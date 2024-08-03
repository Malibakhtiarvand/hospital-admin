import _ from "lodash";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const next_Auth_options = {
    providers: [
        CredentialsProvider(
            {
                name: "AdminAuthentication",
                credentials: {
                    phoneNumber: {
                        label: "Phone",
                        type: "text",
                        placeholder: "AdminPhone",
                        value: ""
                    },
                    email: {
                        label: "Email",
                        type: "text",
                        placeholder: "AdminEmail",
                        value: ""
                    },
                    password: {
                        label: "Password",
                        type: "text",
                        placeholder: "AdminPassword",
                        value: ""
                    }
                },
                async authorize(credentials) {
                    var dt = _.omit(credentials, ["csrfToken"])
                    const fe = await fetch("https://localhost:7087/Auth/admin/token", { body: JSON.stringify(dt), method: "POST", headers: { "Content-Type": "application/json" } })
                    const err = fe.status
                    console.log(err);
                    const data = await fe.text()
                    console.log(data);
                    cookies().set("token", data, { expires: new Date(new Date().getTime() + (10 * 24 * 60 * 60 * 1000)) })
                    return credentials
                }
            }
        )
    ]
}