// =========================================
// SHARED UI BEHAVIOR
// Sidebar toggle (mobile) + generic modal close
// =========================================

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebar-scrim");

  if (toggle && sidebar && scrim) {
    function openSidebar() {
      sidebar.classList.add("open");
      scrim.classList.add("visible");
      // Stop the page behind the drawer from scrolling while it's open.
      document.body.classList.add("no-scroll");
    }

    function closeSidebar() {
      sidebar.classList.remove("open");
      scrim.classList.remove("visible");
      document.body.classList.remove("no-scroll");
    }

    toggle.addEventListener("click", function () {
      // Tapping the hamburger again should close it, not just re-open it.
      if (sidebar.classList.contains("open")) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    scrim.addEventListener("click", closeSidebar);

    // Close sidebar after navigating on mobile
    sidebar.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeSidebar);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && sidebar.classList.contains("open")) {
        closeSidebar();
      }
    });
  }
});

// Close any modal when clicking its backdrop directly
document.addEventListener("click", function (event) {
  if (event.target.classList && event.target.classList.contains("modal-backdrop")) {
    event.target.classList.remove("visible");
  }
});

// Close any open modal on Escape
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.visible").forEach(function (box) {
      box.classList.remove("visible");
    });
  }
});
