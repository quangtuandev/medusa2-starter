import ContactForm from "@app/components/contact/form";
import ContactSuccess from "@app/components/contact/success";
import { useState } from "react";

export default function Contact() {

    const [success, setSuccess] = useState(false);

    return (
        <>
            {success ? <ContactSuccess /> : <ContactForm />}
        </>
    );
}
