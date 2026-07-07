// ─── CONFIG ───────────────────────────────────────────────────
var SUPABASE_URL      = "https://jecwtcwiveetxeunbtgd.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplY3d0Y3dpdmVldHhldW5idGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNzk2MjEsImV4cCI6MjA5Mjg1NTYyMX0.VMPx2nBkq8oUfRNXqU8ZfF0Yx5U4OJMHxkAZ9TUOD_I";

// ──────────────────────────────────────────────────────────────

function saveLead(data) {
  return fetch(SUPABASE_URL + "/rest/v1/expat_mortgage_leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": "Bearer " + SUPABASE_ANON_KEY,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(data)
  });
}

function sendEmailAlert(data) {
  fetch(SUPABASE_URL + "/functions/v1/send-lead-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}


$(document).ready(function () {

  // Smooth scroll
  $(".js-scroll-trigger").on("click", function (e) {
    var target = $(this).attr("href");
    if (target && target.startsWith("#") && $(target).length) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: $(target).offset().top - 70 }, 800, "easeInOutExpo");
      if ($(".navbar-collapse").hasClass("show")) {
        $(".navbar-collapse").collapse("hide");
      }
    }
  });

  // Navbar shrink on scroll
  function navbarShrink() {
    if ($(window).scrollTop() > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  }
  navbarShrink();
  $(window).scroll(navbarShrink);

  $("body").scrollspy({ target: "#mainNav", offset: 80 });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) { $(".scroll-to-top").fadeIn(); }
    else { $(".scroll-to-top").fadeOut(); }
  });

  AOS.init({ duration: 800, once: true });

$(".reviewslider").slick({
    slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 5000,
    arrows: false, dots: false
  });

  $(".review-prev").on("click", function () { $(".reviewslider").slick("slickPrev"); });
  $(".review-next").on("click", function () { $(".reviewslider").slick("slickNext"); });

  $("input:checkbox[name='quotecheckbox']").on("click", function () {
    var $box = $(this);
    if ($box.is(":checked")) {
      $("input:checkbox[name='quotecheckbox']").prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
  });

  // ── QUOTE FORM ─────────────────────────────────────────────
  $(".quoteform").on("submit", function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn  = $form.find("button[type=submit]");
    var $ok   = $form.find(".form-success");
    var $err  = $form.find(".form-error");

    var data = {
      form_type:      "quote",
      source:         $form.find("input[name='leadsource']").val() || "uk",
      property_type:  $form.find("input[name='quotecheckbox']:checked").val() || "",
      property_value: $form.find("input[name='mortgagepropertyvalue']").val(),
      loan_amount:    $form.find("input[name='mortgageloanamount']").val(),
      name:           $form.find("input[name='mortgagename']").val(),
      email:          $form.find("input[name='mortgageemail']").val(),
      phone:          $form.find("input[name='mortgagecontactnumber']").val()
    };

    if (!data.name || !data.email || !data.phone) { $err.text("Please fill in your name, email and contact number.").show(); return; }

    $btn.prop("disabled", true).text("Sending...");
    $ok.hide(); $err.hide();

    saveLead(data)
      .then(function (res) {
        if (!res.ok) throw new Error();
        sendEmailAlert(data);
        window.location.href = "/thank-you";
      })
      .catch(function () {
        $err.text("Something went wrong. Please try again or call us directly.").show();
        $btn.prop("disabled", false).text("Submit");
      });
  });

  // ── CALLBACK FORM ──────────────────────────────────────────
  $(".callbackform").on("submit", function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn  = $form.find("button[type=submit]");
    var $ok   = $form.find(".form-success");
    var $err  = $form.find(".form-error");

    var data = {
      form_type: "callback",
      source:    $form.find("input[name='leadsource']").val() || "uk",
      best_time: $form.find("input[name='callbackbesttime']").val(),
      name:      $form.find("input[name='callbackname']").val(),
      phone:     $form.find("input[name='callbacknumber']").val(),
      message:   $form.find("textarea[name='callbackmessage']").val()
    };

    if (!data.name || !data.phone) { $err.text("Please fill in your name and contact number.").show(); return; }

    $btn.prop("disabled", true).text("Sending...");
    $ok.hide(); $err.hide();

    saveLead(data)
      .then(function (res) {
        if (!res.ok) throw new Error();
        sendEmailAlert(data);
        window.location.href = "/thank-you";
      })
      .catch(function () {
        $err.text("Something went wrong. Please try again or call us directly.").show();
        $btn.prop("disabled", false).text("Send Message");
      });
  });

});
