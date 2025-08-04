import React from "react";

export default function Contact() {
  return (
    <div className="contact-container" style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📞 Contact Us</h2>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Email:</strong> <a href="mailto:pizza@delivery.com">pizza@delivery.com</a>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Phone:</strong> <a href="tel:0991234567">099/123-4567</a>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Working Hours:</strong>
        <div>Monday – Friday: 10:00 AM – 10:00 PM</div>
        <div>Saturday: 12:00 PM – 11:00 PM</div>
        <div>Sunday: Closed</div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Address:</strong> Vukovarska Street 1, 31000 Osijek, Croatia
      </div>

      <div style={{ border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden" }}>
        <iframe
          title="Google map Osijek"
          src="http://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.7542086721067!2d18.67867251558228!3d45.55773677910168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475ce70df2926ff7%3A0x9e996ef3191f7d8f!2sVukovarska%20ul.%201%2C%2031000%2C%20Osijek!5e0!3m2!1sen!2shr!4v1719575555555"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
