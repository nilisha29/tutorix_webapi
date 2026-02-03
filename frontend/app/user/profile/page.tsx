import { handleWhoAmI } from "@/lib/actions/auth-action";
import { notFound } from "next/navigation";
import UpdateUserForm from "../_components/UpdateProfile";


export default async function Page() {
    const result = await handleWhoAmI();

    if (!result.success) {
        console.error("WhoAmI Error:", result.message);
        throw new Error(`Error fetching user data: ${result.message}`);
    }

    if (!result.data) {
        notFound();
    }

    return (
        <div>
            <UpdateUserForm user={result.data} />
        </div>
    );
}