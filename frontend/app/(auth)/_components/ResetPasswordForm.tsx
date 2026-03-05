"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/lib/api/auth";

const clearClientAuthCookies = () => {
	document.cookie = "auth_token=; Max-Age=0; path=/";
	document.cookie = "user_data=; Max-Age=0; path=/";
};

export default function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token") || "";

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const onSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setError("");
		setSuccess("");

		if (!token) {
			setError("Invalid reset link");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		try {
			setLoading(true);
			const result = await resetPassword({ token, password });
			setSuccess(result.message || "Password reset successful");
			// Ensure any previous session is cleared before navigating to login.
			clearClientAuthCookies();

			setTimeout(() => {
				router.replace("/login");
			}, 1500);
		} catch (err: Error | any) {
			setError(err.message || "Failed to reset password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-green-100 px-6">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
				<h1 className="text-xl font-bold text-gray-800">Reset Password</h1>
				<p className="mt-2 text-sm text-gray-600">Set your new password.</p>

				<form onSubmit={onSubmit} className="mt-5 space-y-4">
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						placeholder="New password"
						className="w-full h-11 rounded-md border px-3 text-sm outline-none"
					/>

					<input
						type="password"
						value={confirmPassword}
						onChange={(event) => setConfirmPassword(event.target.value)}
						placeholder="Confirm password"
						className="w-full h-11 rounded-md border px-3 text-sm outline-none"
					/>

					<button
						type="submit"
						disabled={loading}
						className="w-full h-11 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-60"
					>
						{loading ? "Resetting..." : "Reset Password"}
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
