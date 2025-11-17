import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { send } from "@emailjs/browser";
import { Container } from "../common/container/Container";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await send(
                "service_a1uegfr",
                "template_kh8252q",
                {
                    from_name: data.name,
                    from_email: data.email,
                    to_name: "Kira Parfum Team",
                    message: data.message,
                },
                "PxWigR7xt2Jg86A-K"
            );
            reset();
            onSubmitSuccess();
        } catch (error) {
            console.error("EmailJS error:", error);
            setError("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative xl:min-h-[1146px] overflow-hidden flex flex-col justify-center">
            <div className="hidden xl:block w-[2000px] absolute inset-0 left-1/2 -translate-x-1/2">
                <img src="/assets/images/contact.webp" alt="Contact" className="absolute top-0 left-0 w-[1700px] h-[1146px] object-cover z-0" />
            </div>
            <Container>
                <div className="contact-form-container relative">
                    <h1 className="text-4xl font-centuryBook italic xl:text-[64px] leading-normal xl:leading-[48px] tracking-normal text-center text-primary mb-6">Contact Us</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 z-10 relative max-w-[446px] mb-6 xl:mb-[100px] xl:ml-auto xl:mr-[170px]">
                        <div>
                            <input
                                id="name"
                                type="text"
                                {...register("name")}
                                className="w-full px-3 py-2 border border-primary rounded-full focus:outline-none focus:ring-1 focus:ring-highlight focus:border-highlight placeholder:text-primary placeholder:text-sm placeholder:font-medium"
                                placeholder="Name"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <input
                                id="email"
                                type="email"
                                {...register("email")}
                                className="w-full px-3 py-2 border border-primary rounded-full focus:outline-none focus:ring-1 focus:ring-highlight focus:border-highlight placeholder:text-primary placeholder:text-sm placeholder:font-medium"
                                placeholder="Email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <textarea
                                id="message"
                                rows={5}
                                {...register("message")}
                                className="w-full px-3 py-2 border border-primary rounded-[20px] focus:outline-none focus:ring-1 focus:ring-highlight focus:border-highlight placeholder:text-primary placeholder:text-sm placeholder:font-medium"
                                placeholder="Message"
                            />
                            {errors.message && (
                                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-3 font-extrabold text-[16.93px] h-[48px] px-[40px] leading-none tracking-normal text-center font-montserrat bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    "Send"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mb-6 xl:mb-0 font-title font-light text-base xl:text-[20px] leading-normal xl:leading-[30px] tracking-normal text-center text-primary xl:absolute bottom-6 xl:bottom-[150px] right-0 w-full xl:w-1/2 max-w-[720px] ml-auto xl:mr-[170px]">
                    We'll be happy to answer any questions you may have :) If you have a problem with your order, please give us your order number so that we can help you as quickly as possible!
                    <br />
                    Our email: <a href="mailto:bykiraperfume@gmail.com" className="text-primary underline">bykiraperfume@gmail.com</a>
                </p>
            </Container>
        </section>
    );
}