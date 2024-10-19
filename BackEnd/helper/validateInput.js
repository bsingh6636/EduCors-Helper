const validateInput = (req, res) => {
    let { UserName, Password, Name, Email, Country } = req.body;
    
    // Check for required fields
    if (!UserName || !Password || !Name || !Email) {
        return res.status(400).json({ success: false, message: "UserName, Password, Name, and Email are required." });
    }

    // Validate UserName
    if (UserName.length < 5 || UserName.length > 15) {
        return res.status(400).json({ success: false, message: "UserName must be at least 5 characters long and at most 15 characters long." });
    }
    if (!/^[a-zA-Z0-9]+$/.test(UserName)) {
        return res.status(400).json({ success: false, message: "UserName can only contain alphanumeric characters." });
    }

    // Validate Password
    if (Password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });
    }
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})/.test(Password)) {
        return res.status(400).json({ success: false, message: "Password must contain at least one uppercase letter and one number." });
    }

    // Validate Name
    if (Name.length < 5 || Name.length > 50) {
        return res.status(400).json({ success: false, message: "Name must be at least 5 characters long and at most 50 characters long." });
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ success: false, message: "Invalid email address." });
    }

    // If all validations pass, return true (or handle as needed)
    return { success: true };
};

module.exports = validateInput;
