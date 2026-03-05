"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/api/auth";

export default function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const onSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setSuccess("");

		if (!email.trim()) {
			setError("Please enter your email");
			return;
		}

		try {
			setLoading(true);
			const result = await forgotPassword(email.trim());
			setSuccess(result.message || "If that email is registered, a reset link has been sent.");
		} catch (err: Error | any) {
			setError(err.message || "Failed to process request");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-green-100 px-6">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
				<h1 className="text-xl font-bold text-gray-800">Forgot Password</h1>
				<p className="mt-2 text-sm text-gray-600">Enter your email to get a reset link.</p>

				<form onSubmit={onSubmit} className="mt-5 space-y-4">
					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="E-mail"
						className="w-full h-11 rounded-md border px-3 text-sm outline-none"
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full h-11 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60"
					>
						{loading ? "Processing..." : "Send Reset Link"}
					</button>
				</form>

				{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
				{success && <p className="mt-3 text-sm text-green-700">{success}</p>}

				<p className="mt-5 text-sm">
					Back to{" "}
					<Link href="/login" className="text-blue-600 font-semibold">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
