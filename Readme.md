# Steam Deal Finder

A Chrome extension that filters and highlights Steam search results based on user-defined criteria for minimum discount and review scores.

## Chrome Web Store Listing Information

Below are the fields you will need to fill out when submitting the extension to the Chrome Web Store.

---

### **1. Extension Name**

The name of your extension as it will appear in the Chrome Web Store.

*   **Value:** `Steam Deal Finder`

---

### **2. Short Description**

A brief, one-sentence summary of what your extension does. This appears below the title on the store listing. (Max 132 characters)

*   **Value:** `[Enter a concise and catchy one-sentence description here. e.g., "Filters and highlights Steam search results to help you find the best deals."]`

---

### **3. Detailed Description**

A full description of your extension's features, functionality, and what makes it unique. This is your main opportunity to sell your extension to potential users.

*   **Value:** 
    ```
    [
    **Detailed Description:**

    Steam Deal Finder enhances your browsing experience on the Steam store by allowing you to filter out noise and focus on the deals that matter most to you. Set your own criteria for discounts and review scores, and the extension will automatically hide games that don't meet your standards and highlight the ones that do.

    **Key Features:**
    *   **Minimum Discount Filter:** Set a minimum discount percentage (0% to 95%) to only see deals that offer significant savings.
    *   **Minimum Review Score Highlight:** Set a minimum review percentile (e.g., 75% for "Mostly Positive") to highlight games with a positive community reception. Highlighted deals get a glowing effect to make them stand out!
    *   **Steam-like UI:** A clean, modern settings panel that matches the Steam aesthetic.
    *   **Infinite Scroll Compatibility:** Works seamlessly with Steam's infinite scroll search results.

    **How to Use:**
    1. Click the extension icon in your Chrome toolbar to open the settings popup.
    2. Adjust the sliders to set your desired minimum discount and review score.
    3. Click "Save".
    4. The Steam search page will automatically reload with your new filters applied. Happy deal hunting!
    ]
    ```

---

### **4. Icon**

Your extension's icon. You will need to upload a 128x128 pixel image. We have already configured the `manifest.json` to use `icon.png`.

*   **File:** `icon.png` (128x128)

---

### **5. Screenshots**

You must provide at least one screenshot of your extension in action. It's recommended to provide several to showcase its features.

*   **Required Dimensions:** 1280x800 pixels or 640x400 pixels.
*   **Suggested Screenshots:**
    *   A screenshot of the options popup (`options.html`) showing the settings panel.
    *   A "before" screenshot of a normal Steam search result page.
    *   An "after" screenshot showing the extension filtering and highlighting results.

---

### **6. Promotional Images (Optional but Recommended)**

These images are used for featuring your extension on the Chrome Web Store.

*   **Small Promo Tile:** 440x280 pixels. A simple, eye-catching graphic.
*   **Marquee Promo Tile:** 1400x560 pixels. A larger banner used for features on the store's homepage.

---

### **7. Category**

Choose the category that best fits your extension.

*   **Suggested Category:** `Shopping` or `Productivity`

---

### **8. Privacy Policy**

You must explain how your extension handles user data. Since this extension interacts with a webpage, a privacy policy is required. You will need to host a privacy policy document online and provide the URL.

*   **Privacy Policy Content:**
    ```
    [
    **Privacy Policy for Steam Deal Finder**

    Last Updated: [Date]

    This Privacy Policy describes how Steam Deal Finder ("we", "us", or "our") handles your information when you use our Chrome extension.

    **Information We Collect**
    Steam Deal Finder does **not** collect, store, or transmit any personal data from its users. 

    **Extension Settings**
    Your preferences for the "Minimum Discount" and "Minimum Review Score" are stored locally on your computer using the `chrome.storage.sync` API. This data is synced to your Google Account if you have Chrome sync enabled, allowing your settings to be consistent across your devices. This data is not accessed by or transmitted to us.

    **Website Data**
    The extension reads data directly from the Steam search results page (store.steampowered.com/search/*) to filter and highlight deals. This data is processed locally within your browser and is never sent to any external server.

    **Changes to This Policy**
    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

    **Contact Us**
    If you have any questions about this Privacy Policy, please contact us at [Your Email Address].
    ]
    ```
*   **URL:** `[Link to your hosted privacy policy]`

---

### **9. Contact Information**

Provide an email address for user support inquiries.

*   **Email:** `[Your Support Email Address]`

---

## Chrome Web Store - Reviewer Information

This section is for providing information required during the Chrome Web Store review process.

### **Single Purpose**

An extension must have a single purpose that is narrow and easy-to-understand.

*   **Justification:** To help users find better deals on the Steam store by filtering and highlighting search results based on their preferred discount and review score.

### **Permission Justification**

A permission is either one of a list of known strings, such as "activeTab", or a match pattern giving access to one or more hosts. Remove any permission that is not needed to fulfill the single purpose of your extension. Requesting an unnecessary permission will result in this version being rejected.

*   **storage justification:** To save the user's chosen discount and review score settings so they don't have to set them again every time they use the extension.

*   **tabs justification:** To automatically refresh the Steam search page after the user saves their settings, allowing the new filters to be applied immediately.

*   **host permission justification (`https://store.steampowered.com/search/*`):** To allow the extension to access and modify the content of Steam search pages. This is necessary to read game details and apply the user's filters and highlights. 