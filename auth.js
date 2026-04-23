// auth.js – Modal open/close, login, sign-up, logout

(function () {
    const modal       = document.getElementById("authModal");
    const loginForm   = document.getElementById("loginForm");
    const signupForm  = document.getElementById("signupForm");

    // ── helpers ──────────────────────────────────────────
    function openModal(showSignup = false) {
        if (!modal) return;
        modal.classList.remove("hidden");
        if (showSignup) {
            loginForm.classList.add("hidden");
            signupForm.classList.remove("hidden");
        } else {
            signupForm.classList.add("hidden");
            loginForm.classList.remove("hidden");
        }
    }
    function closeModal() {
        if (modal) modal.classList.add("hidden");
    }

    // ── open / close buttons ──────────────────────────────
    document.getElementById("openLoginBtn")  ?.addEventListener("click", () => openModal(false));
    document.getElementById("openSignupBtn") ?.addEventListener("click", () => openModal(true));
    document.getElementById("closeModal")    ?.addEventListener("click", closeModal);
    modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });

    // form switchers
    document.getElementById("switchToSignup")?.addEventListener("click", e => { e.preventDefault(); openModal(true); });
    document.getElementById("switchToLogin") ?.addEventListener("click", e => { e.preventDefault(); openModal(false); });

    // login from "Saved cities" prompt links (not logged in state)
    document.getElementById("promptLoginBtn") ?.addEventListener("click", e => { e.preventDefault(); openModal(false); });
    document.getElementById("promptSignupBtn")?.addEventListener("click", e => { e.preventDefault(); openModal(true); });

    // ── LOGIN ────────────────────────────────────────────
    document.getElementById("loginSubmit")?.addEventListener("click", function () {
        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;
        const errEl    = document.getElementById("loginError");
        errEl.textContent = "";

        if (!username || !password) {
            errEl.textContent = "Please fill in all fields.";
            return;
        }

        fetch("auth.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
        })
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                errEl.textContent = data.error;
            } else {
                // Reload so PHP session is reflected in header & saved-cities section
                location.reload();
            }
        })
        .catch(() => { errEl.textContent = "Login failed. Try again."; });
    });

    // ── SIGN UP ──────────────────────────────────────────
    document.getElementById("signupSubmit")?.addEventListener("click", function () {
        const username = document.getElementById("signupUsername").value.trim();
        const email    = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const errEl    = document.getElementById("signupError");
        errEl.textContent = "";

        if (!username || !email || !password) {
            errEl.textContent = "Please fill in all fields.";
            return;
        }

        fetch("auth.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `action=signup&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                errEl.textContent = data.error;
            } else {
                location.reload();
            }
        })
        .catch(() => { errEl.textContent = "Sign-up failed. Try again."; });
    });

    // ── LOGOUT ───────────────────────────────────────────
    document.getElementById("logoutBtn")?.addEventListener("click", function () {
        fetch("auth.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "action=logout"
        })
        .then(() => location.reload());
    });

    // Allow Enter key in auth inputs
    ["loginUsername","loginPassword"].forEach(id => {
        document.getElementById(id)?.addEventListener("keydown", e => {
            if (e.key === "Enter") document.getElementById("loginSubmit").click();
        });
    });
    ["signupUsername","signupEmail","signupPassword"].forEach(id => {
        document.getElementById(id)?.addEventListener("keydown", e => {
            if (e.key === "Enter") document.getElementById("signupSubmit").click();
        });
    });
})();
