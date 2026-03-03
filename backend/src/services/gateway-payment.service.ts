import crypto from "crypto";
import {
  ESEWA_INITIATE_URL,
  ESEWA_PRODUCT_CODE,
  ESEWA_SECRET_KEY,
  ESEWA_STATUS_URL,
  FRONTEND_BASE_URL,
  KHALTI_INITIATE_URL,
  KHALTI_LOOKUP_URL,
  KHALTI_SECRET_KEY,
} from "../config";
import { HttpError } from "../errors/http-error";

type RedirectMethod = "GET" | "POST";

export class GatewayPaymentService {
  private ensureGatewaySecret(key: string, gateway: "khalti" | "esewa") {
    const normalized = String(key || "").trim();
    const isPlaceholder =
      !normalized ||
      normalized.includes("replace-with") ||
      normalized.includes("your-") ||
      normalized.includes("sandbox-secret-key");

    if (isPlaceholder) {
      const envName = gateway === "khalti" ? "KHALTI_SECRET_KEY" : "ESEWA_SECRET_KEY";
      throw new HttpError(500, `${gateway} secret key is not configured. Set ${envName} in backend/.env and restart backend server.`);
    }
  }

  private async parseGatewayResponse(response: Response) {
    const rawText = await response.text();
    try {
      return rawText ? JSON.parse(rawText) : {};
    } catch {
      return { raw: rawText };
    }
  }

  private buildResultUrl(params: {
    bookingId: string;
    provider: "khalti" | "esewa";
    status?: "success" | "failed";
    paymentRef: string;
  }) {
    const query = new URLSearchParams({
      bookingId: params.bookingId,
      provider: params.provider,
      paymentRef: params.paymentRef,
    });

    if (params.status) {
      query.set("status", params.status);
    }

    return `${FRONTEND_BASE_URL}/payment/result?${query.toString()}`;
  }

  async initiateKhaltiPayment(payload: {
    bookingId: string;
    paymentRef: string;
    amount: number;
    customerName: string;
  }) {
    this.ensureGatewaySecret(KHALTI_SECRET_KEY, "khalti");

    const returnUrl = this.buildResultUrl({
      bookingId: payload.bookingId,
      provider: "khalti",
      paymentRef: payload.paymentRef,
    });

    const requestBody = {
      return_url: returnUrl,
      website_url: FRONTEND_BASE_URL,
      amount: Math.round(payload.amount * 100),
      purchase_order_id: payload.paymentRef,
      purchase_order_name: `Tutor Booking ${payload.paymentRef}`,
      customer_info: {
        name: payload.customerName,
      },
    };

    const response = await fetch(KHALTI_INITIATE_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const responseBody = await this.parseGatewayResponse(response);

    if (!response.ok || !responseBody?.payment_url || !responseBody?.pidx) {
      const detail =
        responseBody?.detail ||
        responseBody?.message ||
        responseBody?.error_key ||
        responseBody?.raw ||
        "Unknown Khalti error";
      throw new HttpError(400, `Failed to initiate Khalti payment: ${detail}`);
    }

    return {
      redirectUrl: responseBody.payment_url as string,
      redirectMethod: "GET" as RedirectMethod,
      redirectFormFields: undefined,
      gatewayRef: String(responseBody.pidx),
      successUrl: this.buildResultUrl({
        bookingId: payload.bookingId,
        provider: "khalti",
        paymentRef: payload.paymentRef,
        status: "success",
      }),
      failureUrl: this.buildResultUrl({
        bookingId: payload.bookingId,
        provider: "khalti",
        paymentRef: payload.paymentRef,
        status: "failed",
      }),
      rawInitiateResponse: responseBody,
    };
  }

  async verifyKhaltiPayment(pidx: string) {
    this.ensureGatewaySecret(KHALTI_SECRET_KEY, "khalti");

    const response = await fetch(KHALTI_LOOKUP_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const responseBody = await this.parseGatewayResponse(response);

    if (!response.ok) {
      const detail =
        responseBody?.detail ||
        responseBody?.message ||
        responseBody?.error_key ||
        responseBody?.raw ||
        "Unknown Khalti error";
      throw new HttpError(400, `Failed to verify Khalti payment: ${detail}`);
    }

    const normalized = String(responseBody?.status || "").toLowerCase();
    const isPaid = ["completed", "success", "paid"].includes(normalized);

    return {
      isPaid,
      gatewayTxnId: String(
        responseBody?.transaction_id || responseBody?.idx || responseBody?.pidx || pidx
      ),
      rawVerifyResponse: responseBody,
    };
  }

  private createEsewaSignature(totalAmount: string, transactionUuid: string) {
    this.ensureGatewaySecret(ESEWA_SECRET_KEY, "esewa");

    const signedFieldNames = "total_amount,transaction_uuid,product_code";
    const signatureBase = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_PRODUCT_CODE}`;

    const signature = crypto
      .createHmac("sha256", ESEWA_SECRET_KEY)
      .update(signatureBase)
      .digest("base64");

    return { signedFieldNames, signature };
  }

  async initiateEsewaPayment(payload: {
    bookingId: string;
    paymentRef: string;
    amount: number;
  }) {
    const totalAmount = payload.amount.toFixed(2);
    const transactionUuid = payload.paymentRef;
    const { signedFieldNames, signature } = this.createEsewaSignature(totalAmount, transactionUuid);

    const successUrl = this.buildResultUrl({
      bookingId: payload.bookingId,
      provider: "esewa",
      paymentRef: payload.paymentRef,
      status: "success",
    });

    const failureUrl = this.buildResultUrl({
      bookingId: payload.bookingId,
      provider: "esewa",
      paymentRef: payload.paymentRef,
      status: "failed",
    });

    const redirectFormFields: Record<string, string> = {
      amount: totalAmount,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: signedFieldNames,
      signature,
    };

    return {
      redirectUrl: ESEWA_INITIATE_URL,
      redirectMethod: "POST" as RedirectMethod,
      redirectFormFields,
      gatewayRef: transactionUuid,
      successUrl,
      failureUrl,
      rawInitiateResponse: {
        endpoint: ESEWA_INITIATE_URL,
        ...redirectFormFields,
      },
    };
  }

  async verifyEsewaPayment(payload: { transactionUuid: string; totalAmount: number }) {
    const statusUrl = new URL(ESEWA_STATUS_URL);
    statusUrl.searchParams.set("product_code", ESEWA_PRODUCT_CODE);
    statusUrl.searchParams.set("total_amount", payload.totalAmount.toFixed(2));
    statusUrl.searchParams.set("transaction_uuid", payload.transactionUuid);

    const response = await fetch(statusUrl.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const responseBody = await this.parseGatewayResponse(response);

    if (!response.ok) {
      throw new HttpError(400, "Failed to verify eSewa payment");
    }

    const normalized = String(responseBody?.status || "").toLowerCase();
    const isPaid = ["complete", "completed", "success", "paid"].includes(normalized);

    return {
      isPaid,
      gatewayTxnId: String(
        responseBody?.ref_id || responseBody?.transaction_code || responseBody?.transaction_uuid || payload.transactionUuid
      ),
      rawVerifyResponse: responseBody,
    };
  }
}
