import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Linkedin, Github, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        alert('Thank you for your message! I will get back to you soon.');
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="space-y-6 animate-fadeUp" >
                    <div className="card-white p-6">
                        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            Contact Information
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                                <Mail className="w-6 h-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                    <a href="mailto:shaibalsharif@gmail.com" className="text-primary hover:underline">
                                        shaibalsharif@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                                <Phone className="w-6 h-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                    <a href="tel:+8801521330598" className="text-primary hover:underline">
                                        +880-152-1330598
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                                <MapPin className="w-6 h-6 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">Location</h3>
                                    <p className="text-muted-foreground">Mirpur, Dhaka, Bangladesh</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-foreground mb-4">Connect With Me</h3>
                            <div className="flex gap-4">
                                <a
                                    href="https://linkedin.com/in/shaibal-sharif"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                                >
                                    <Linkedin className="w-6 h-6 text-primary" />
                                </a>
                                <a
                                    href="https://github.com/shaibalsharif"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                                >
                                    <Github className="w-6 h-6 text-primary" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="animate-fadeUp" >
                    <div className="card-white p-6">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                    Your Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                                    placeholder="Project Inquiry"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                    Your Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-lime flex items-center justify-center gap-3"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export { Contact };