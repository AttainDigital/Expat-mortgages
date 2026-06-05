// ─── WEBHOOK CONFIG ───────────────────────────────────────────────
// Paste your GHL inbound webhook URL here when ready
var GHL_WEBHOOK_URL = "YOUR_GHL_WEBHOOK_URL_HERE";
// ──────────────────────────────────────────────────────────────────

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

  // Active nav link on scroll
  $("body").scrollspy({ target: "#mainNav", offset: 80 });

  // Scroll to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".scroll-to-top").fadeIn();
    } else {
      $(".scroll-to-top").fadeOut();
    }
  });

  // AOS
  AOS.init({ duration: 800, once: true });

  // Bank logo slider
  $(".clientslider").slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: false,
    dots: false,
    pauseOnHover: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }
    ]
  });

  // Review slider
  $(".reviewslider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    dots: false
  });

  $(".review-prev").on("click", function () { $(".reviewslider").slick("slickPrev"); });
  $(".review-next").on("click", function () { $(".reviewslider").slick("slickNext"); });

  // Checkbox single-select (property type)
  $("input:checkbox[name='quotecheckbox']").on("click", function () {
    var $box = $(this);
    if ($box.is(":checked")) {
      $("input:checkbox[name='quotecheckbox']").prop("checked", false);
      $box.prop("checked", true);
    } else {
      $box.prop("checked", false);
    }
  });

  // ── QUOTE FORM SUBMIT ──────────────────────────────────────────
  $(".quoteform").on("submit", function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find("button[type=submit]");
    var $success = $form.find(".form-success");
    var $error = $form.find(".form-error");

    var data = {
      form_type: "quote",
      property_type: $form.find("input[name='quotecheckbox']:checked").val() || "",
      property_value: $form.find("input[name='mortgagepropertyvalue']").val(),
      loan_amount: $form.find("input[name='mortgageloanamount']").val(),
      name: $form.find("input[name='mortgagename']").val(),
      email: $form.find("input[name='mortgageemail']").val(),
      phone: $form.find("input[name='mortgagecontactnumber']").val()
    };

    if (!data.name || !data.email) {
      $error.text("Please fill in your name and email.").show();
      return;
    }

    $btn.prop("disabled", true).text("Sending...");
    $success.hide(); $error.hide();

    if (GHL_WEBHOOK_URL === "YOUR_GHL_WEBHOOK_URL_HERE") {
      // Webhook not yet configured — show success anyway for testing
      $success.text("Thank you! We will be in touch shortly.").show();
      $form[0].reset();
      $btn.prop("disabled", false).text("Submit");
      return;
    }

    $.ajax({
      url: GHL_WEBHOOK_URL,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function () {
        $success.text("Thank you! We will be in touch shortly.").show();
        $form[0].reset();
        $btn.prop("disabled", false).text("Submit");
      },
      error: function () {
        $error.text("Something went wrong. Please try again or call us directly.").show();
        $btn.prop("disabled", false).text("Submit");
      }
    });
  });

  // ── CALLBACK FORM SUBMIT ───────────────────────────────────────
  $(".callbackform").on("submit", function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find("button[type=submit]");
    var $success = $form.find(".form-success");
    var $error = $form.find(".form-error");

    var data = {
      form_type: "callback",
      best_time: $form.find("input[name='callbackbesttime']").val(),
      name: $form.find("input[name='callbackname']").val(),
      phone: $form.find("input[name='callbacknumber']").val(),
      message: $form.find("textarea[name='callbackmessage']").val()
    };

    if (!data.name || !data.phone) {
      $error.text("Please fill in your name and contact number.").show();
      return;
    }

    $btn.prop("disabled", true).text("Sending...");
    $success.hide(); $error.hide();

    if (GHL_WEBHOOK_URL === "YOUR_GHL_WEBHOOK_URL_HERE") {
      $success.text("Thank you! An expert will call you back shortly.").show();
      $form[0].reset();
      $btn.prop("disabled", false).text("Send Message");
      return;
    }

    $.ajax({
      url: GHL_WEBHOOK_URL,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function () {
        $success.text("Thank you! An expert will call you back shortly.").show();
        $form[0].reset();
        $btn.prop("disabled", false).text("Send Message");
      },
      error: function () {
        $error.text("Something went wrong. Please try again or call us directly.").show();
        $btn.prop("disabled", false).text("Send Message");
      }
    });
  });

});
