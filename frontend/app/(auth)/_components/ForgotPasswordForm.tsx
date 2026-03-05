// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { forgotPassword } from "@/lib/api/auth";

// export default function ForgotPasswordForm() {
// 	const [email, setEmail] = useState("");
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState("");
// 	const [success, setSuccess] = useState("");

// 	const onSubmit = async (event: React.FormEvent) => {
// 		event.preventDefault();
// 		setError("");
// 		setSuccess("");

// 		if (!email.trim()) {
// 			setError("Please enter your email");
// 			return;
// 		}

// 		try {
// 			setLoading(true);
// 			const result = await forgotPassword(email.trim());
// 			setSuccess(result.message || "If that email is registered, a reset link has been sent.");
// 		} catch (err: Error | any) {
// 			setError(err.message || "Failed to process request");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-green-100 px-6">
// 			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
// 				<h1 className="text-xl font-bold text-gray-800">Forgot Password</h1>
// 				<p className="mt-2 text-sm text-gray-600">Enter your email to get a reset link.</p>

// 				<form onSubmit={onSubmit} className="mt-5 space-y-4">
// 					<input
// 						type="email"
// 						value={email}
// 						onChange={(event) => setEmail(event.target.value)}
// 						placeholder="E-mail"
// 						className="w-full h-11 rounded-md border px-3 text-sm outline-none"
// 					/>

// 					<button
// 						type="submit"
// 						disabled={loading}
// 						className="w-full h-11 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60"
// 					>
// 						{loading ? "Processing..." : "Send Reset Link"}
// 					</button>
// 				</form>

// 				{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
// 				{success && <p className="mt-3 text-sm text-green-700">{success}</p>}

// 				<p className="mt-5 text-sm">
// 					Back to{" "}
// 					<Link href="/login" className="text-blue-600 font-semibold">
// 						Login
// 					</Link>
// 				</p>
// 			</div>
// 		</div>
// 	);
// }



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
		<div className="w-full min-h-screen flex items-center justify-center bg-green-200">
			<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg border border-gray-100">
				<h1 className="text-2xl font-bold text-gray-800 text-center">Forgot Password</h1>
				<p className="mt-2 text-center text-gray-600 text-sm">
					Enter your email to receive a password reset link.
				</p>

				<form onSubmit={onSubmit} className="mt-6 space-y-4">
					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="E-mail"
						className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:ring-2 focus:ring-green-400 transition"
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full h-12 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-60 transition"
					>
						{loading ? "Processing..." : "Send Reset Link"}
					</button>
				</form>

				{error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
				{success && <p className="mt-4 text-sm text-green-700 text-center">{success}</p>}

				<p className="mt-6 text-sm text-center text-gray-600">
					Back to{" "}
					<Link href="/login" className="text-blue-600 font-semibold hover:underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}


