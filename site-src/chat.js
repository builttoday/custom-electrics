/* ===================== Custom Electrics — website chat assistant =====================
   A scripted triage tree. Buttons only: there is deliberately no free-text box and no
   language model behind this.

   Nearly every visitor wants one of six things, and a button answers those instantly, in
   words Will has approved. Removing the text box removes the three things that came with
   it -- a per-message API cost, the chance of an invented answer on a trading
   electrician's own website, and a public endpoint to defend. What is left is the part
   that was doing the work anyway.

   The only network call is the callback form, which posts to the same website-enquiry
   function as the contact page. No dependencies, no framework, loaded with `defer`. */
(function () {
  "use strict";

  var PHONE = "07734 157465";
  var TEL = "tel:07734157465";
  var EMAIL = "will@customelectrics.co.uk";
  var FN_BASE = "https://vbhrslysnnhjdhbyhqgm.supabase.co/functions/v1";

  /* ---------------------------------------------------------------------------------
     The script. Each node: what the bot says, then the buttons offered.
     `capture` opens the callback form, `call` dials, `start` goes back to the top.

     Copy here is lifted from the service pages deliberately -- one voice, and anything
     corrected on a page gets corrected here too. Nothing in this tree states a price,
     gives a repair procedure, or claims a qualification.
     --------------------------------------------------------------------------------- */
  var TREE = {
    start: {
      say: "Hi — I can help you work out what you need, or get you a call back. What's it about?",
      options: [
        ["Something's not working", "fault"],
        ["Old fuse board", "board"],
        ["EICR / landlord certificate", "eicr"],
        ["EV charger", "ev"],
        ["Extra sockets or lighting", "sockets"],
        ["Rewire", "rewire"],
        ["Something else", "other"],
      ],
    },

    /* Safety gate first. This is the only branch where getting it wrong matters, so it
       is asked before anything else and the dangerous answer short-circuits the tree. */
    fault: {
      say: "First, an important one — is there a burning smell, buzzing, sparking, scorch marks or discolouration round a socket, or has anyone had a shock?",
      options: [
        ["Yes, one of those", "danger"],
        ["No, nothing like that", "fault2"],
      ],
    },
    danger: {
      say: "Then please switch that circuit off at the fuse board now and leave it off. That needs looking at today — ring Will rather than waiting on a message. If there's a fire or anyone's hurt, ring 999.",
      options: [["Call " + PHONE, "call"], ["Back to the start", "start"]],
      urgent: true,
    },
    fault2: {
      say: "Right. Two things worth trying before paying anyone: unplug everything on that circuit and reset the breaker — a failing appliance causes this more often than the wiring does. And if it's an outside light or a garage, see whether it stops in dry weather, because that points to water getting in.",
      options: [
        ["Still not fixed", "fault3"],
        ["The whole house is off", "whole"],
        ["That sorted it, thanks", "solved"],
      ],
    },
    fault3: {
      say: "Then it needs tracing properly with instruments rather than guessing. Will charges for the time it takes, with a limit agreed up front, and most faults are found within an hour or two.",
      options: [["Leave my number", "capture"], ["Call " + PHONE, "call"], ["Back to the start", "start"]],
      service: "Fault finding",
    },
    whole: {
      say: "Check whether your neighbours are off too. If the whole street is out it's the network operator, not an electrician — ring 105, it's free. If it's only your house, it's worth Will looking.",
      options: [["Only my house", "fault3"], ["Back to the start", "start"]],
    },
    solved: {
      say: "Good — glad that saved you a call-out. Anything else I can help with?",
      options: [["Back to the start", "start"], ["No, thanks", "bye"]],
    },

    board: {
      say: "If yours has rewireable fuses, or trip switches with no test button, it predates the current regulations and has no RCD protection — replacing it is the biggest safety improvement most houses can have, and it's normally a day's work.",
      options: [
        ["What do I get?", "board2"],
        ["What about the certificate?", "notify"],
        ["Leave my number", "capture"],
      ],
      service: "Fuse board / consumer unit",
    },
    board2: {
      say: "A steel unit with an RCBO on every circuit, so one fault no longer blacks out the house and you can see which circuit caused it. Surge protection is included. Will tests every existing circuit before quoting, so the price accounts for anything the old board was quietly tolerating.",
      options: [["What about the certificate?", "notify"], ["Leave my number", "capture"], ["Back to the start", "start"]],
      service: "Fuse board / consumer unit",
    },

    /* The honest answer on notification. Worth its own branch: it is the question a
       customer is most likely to ask about a fuse board after price, and the one a
       generic assistant would answer wrongly. */
    notify: {
      say: "You get a full Electrical Installation Certificate with all the test results. A new board is also notifiable, so it gets registered with Building Control — Will puts the building notice in before starting, the council inspects, and they issue the completion certificate. There's a council fee for that, and he'll tell you what it is before you commit to anything.",
      options: [["Which work is notifiable?", "notify2"], ["Leave my number", "capture"]],
    },
    notify2: {
      say: "A new consumer unit, a brand new circuit, a rewire, and anything inside a bathroom. Most smaller jobs aren't — extra sockets on an existing circuit, swapping light fittings, fault repairs and EICRs all fall outside it, so there's no council involvement or fee.",
      options: [["Leave my number", "capture"], ["Back to the start", "start"]],
    },

    eicr: {
      say: "An EICR is a full inspection and test of the fixed wiring, ending in a report saying satisfactory or not. If you let the property in England it's every 5 years minimum, the tenant gets a copy within 28 days, and any C1, C2 or FI items have to be fixed within 28 days.",
      options: [
        ["What do the codes mean?", "eicr2"],
        ["I've had a fail elsewhere", "eicr3"],
        ["Leave my number", "capture"],
      ],
      service: "EICR / landlord certificate",
    },
    eicr2: {
      say: "C1 is danger present and gets made safe on the spot. C2 is potentially dangerous. Either makes the report unsatisfactory, as does FI. C3 is only 'improvement recommended' — it does not make a report fail and you don't have to action it, so be wary of anyone pressing you to pay for C3 work.",
      options: [["Leave my number", "capture"], ["Back to the start", "start"]],
      service: "EICR / landlord certificate",
    },
    eicr3: {
      say: "That's the common trap — an inspector who doesn't do repairs, and 28 days to find someone who'll re-inspect before they'll quote. Will does the inspection and the remedial work, so it's one visit and one invoice inside the deadline.",
      options: [["Leave my number", "capture"], ["Call " + PHONE, "call"]],
      service: "EICR / landlord certificate",
    },

    ev: {
      say: "The install is straightforward; what matters is whether your supply can take it. A 7.4kW charger pulls 32A for hours, so Will does a proper maximum-demand assessment before quoting — and where the supply is tight, a load-managed charger is nearly always cheaper than upgrading it.",
      options: [["Is there a grant?", "ev2"], ["Leave my number", "capture"]],
      service: "EV charger",
    },
    ev2: {
      say: "The main homeowner grant closed in 2022. It's still open for flats and rented accommodation, and there's a separate landlord scheme. Will will tell you honestly whether you qualify rather than quoting as though you do.",
      options: [["Leave my number", "capture"], ["Back to the start", "start"]],
      service: "EV charger",
    },

    sockets: {
      say: "All normal work — extra sockets, kitchen and bathroom lighting, outdoor sockets, security lights, power to a garage, shed, hot tub or garden office. A single socket is a perfectly good reason to ring; it's priced as the small job it is.",
      options: [
        ["My LED lights flicker", "flicker"],
        ["Power to a shed or office", "outbuilding"],
        ["Leave my number", "capture"],
      ],
      service: "Sockets & lighting",
    },
    flicker: {
      say: "Nearly always a dimmer that isn't rated for LED loads, or a mix of lamp types on one dimmer. It's a cheap fix once diagnosed and doesn't mean anything's wrong with your wiring.",
      options: [["Leave my number", "capture"], ["Back to the start", "start"]],
      service: "Sockets & lighting",
    },
    outbuilding: {
      say: "That's armoured cable buried at the right depth, proper protection at both ends, and usually a small consumer unit in the outbuilding. A garden office running heaters and computers needs sizing properly rather than hanging off a socket circuit.",
      options: [["Leave my number", "capture"], ["Back to the start", "start"]],
      service: "Outdoor power",
    },

    rewire: {
      say: "Worth knowing first: plenty of houses that feel like they need rewiring actually need a consumer unit and a couple of circuits. An EICR tells you which before you commit to the bigger job, and Will will say so if that's what he finds.",
      options: [
        ["What points to a rewire?", "rewire2"],
        ["Can I live in the house?", "rewire3"],
        ["Leave my number", "capture"],
      ],
      service: "Rewire",
    },
    rewire2: {
      say: "Condition rather than age: rubber, lead or fabric-sheathed cable that cracks when flexed, no earth on the lighting circuits, or an EICR with several C2s where the repairs approach the cost of doing it once properly.",
      options: [["Leave my number", "capture"], ["Back to the start", "start"]],
      service: "Rewire",
    },
    rewire3: {
      say: "Usually yes. It's dusty and each room is out of action while it's done, but Will stages it so you've got power and lighting each evening. Mention it up front if anyone works from home or needs power for medical equipment.",
      options: [["Leave my number", "capture"], ["Back to the start", "start"]],
      service: "Rewire",
    },

    other: {
      say: "No problem. Leave your number and Will will ring you back, or give him a call now — he'd rather talk it through than have you guess from a list.",
      options: [["Leave my number", "capture"], ["Call " + PHONE, "call"]],
    },
    bye: {
      say: "Right you are. The number's " + PHONE + " whenever you need it.",
      options: [["Back to the start", "start"]],
    },
  };

  // ---------------------------------------------------------------------------------
  var state = { open: false, node: null, service: "", picked: [], captured: false };
  var el = {};

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function build() {
    var w = document.createElement("div");
    w.className = "ce-chat";
    w.innerHTML =
      '<button class="ce-chat-fab" id="ceFab" aria-expanded="false" aria-controls="cePanel">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-2.8-.4L3 21l1.6-4.6A8.3 8.3 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>' +
        "</svg>" +
        '<span class="ce-chat-fab-label">Ask a question</span>' +
      "</button>" +
      '<div class="ce-chat-panel" id="cePanel" role="dialog" aria-label="Chat with Custom Electrics" hidden>' +
        '<div class="ce-chat-head">' +
          '<img src="/logo.png" alt="" width="34" height="34">' +
          "<div><strong>Custom Electrics</strong><span>Usually answers instantly</span></div>" +
          '<button class="ce-chat-x" id="ceClose" aria-label="Close chat">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          "</button>" +
        "</div>" +
        '<div class="ce-chat-log" id="ceLog" role="log" aria-live="polite"></div>' +
        '<div class="ce-chat-opts" id="ceOpts"></div>' +
        '<p class="ce-chat-foot">Can\'t see what you need? Ring Will on <a href="' + TEL + '">' + PHONE + "</a>.</p>" +
      "</div>";
    document.body.appendChild(w);

    el.fab = document.getElementById("ceFab");
    el.panel = document.getElementById("cePanel");
    el.close = document.getElementById("ceClose");
    el.log = document.getElementById("ceLog");
    el.opts = document.getElementById("ceOpts");

    el.fab.addEventListener("click", toggle);
    el.close.addEventListener("click", toggle);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.open) toggle();
    });
  }

  function toggle() {
    state.open = !state.open;
    el.panel.hidden = !state.open;
    el.fab.setAttribute("aria-expanded", state.open ? "true" : "false");
    document.querySelector(".ce-chat").classList.toggle("open", state.open);
    if (state.open) {
      if (!state.node) go("start");
    }
  }

  function bubble(who, html, cls) {
    var d = document.createElement("div");
    d.className = "ce-msg ce-" + who + (cls ? " " + cls : "");
    d.innerHTML = html;
    el.log.appendChild(d);
    el.log.scrollTop = el.log.scrollHeight;
    return d;
  }

  function setOptions(options) {
    el.opts.innerHTML = "";
    (options || []).forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ce-opt";
      b.textContent = o[0];
      b.addEventListener("click", function () {
        bubble("me", esc(o[0]));
        if (o[1] !== "start" && o[1] !== "call") state.picked.push(o[0]);
        el.opts.innerHTML = "";
        if (o[1] === "call") { window.location.href = TEL; return; }
        if (o[1] === "capture") { showCapture(); return; }
        go(o[1]);
      });
      el.opts.appendChild(b);
    });
  }

  function go(key) {
    var node = TREE[key];
    if (!node) { go("start"); return; }
    state.node = key;
    if (node.service) state.service = node.service;
    state.aiMode = !!node.ai;

    var d = bubble("bot", "<span class='ce-dots'><i></i><i></i><i></i></span>");
    setTimeout(function () {
      d.innerHTML = esc(node.say);
      if (node.urgent) d.classList.add("ce-urgent");
      el.log.scrollTop = el.log.scrollHeight;
      setOptions(node.options);
    }, 260);
  }

  /* ---- callback capture: straight into the same endpoint the contact form uses ---- */
  function showCapture() {
    if (state.captured) {
      bubble("bot", "You've already left your number — Will will be in touch. Anything else?");
      setOptions([["Back to the start", "start"]]);
      return;
    }
    var d = bubble("bot", "Leave a name and number and Will will ring you back. Nothing else needed.");
    var f = document.createElement("form");
    f.className = "ce-cap";
    f.innerHTML =
      '<input type="text" name="name" placeholder="Your name" autocomplete="name" required>' +
      '<input type="tel" name="phone" placeholder="Phone number" autocomplete="tel" required>' +
      '<input type="text" name="postcode" placeholder="Postcode (optional)" autocomplete="postal-code">' +
      '<button type="submit">Send</button>' +
      '<p class="ce-cap-note">Used only to reply to you. Never passed to anyone else.</p>';
    el.log.appendChild(f);
    el.log.scrollTop = el.log.scrollHeight;

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = f.querySelector("button");
      btn.disabled = true;
      btn.textContent = "Sending…";
      var fd = new FormData(f);
      var notes = "Left a phone number via the website chat assistant." +
        (state.picked.length ? "\n\nWhat they tapped through:\n" + state.picked
          .map(function (t) { return "- " + t; }).join("\n") : "");

      fetch(FN_BASE + "/website-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          postcode: fd.get("postcode") || "",
          service: state.service || "Something else",
          notes: notes,
        }),
      }).then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        f.remove();
        state.captured = true;
        bubble("bot", "Got it — Will will give you a ring. If it's urgent, ring him on <a href='" + TEL + "'>" + PHONE + "</a>.", "ce-ok");
        setOptions([["Back to the start", "start"]]);
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = "Send";
        bubble("bot", "That didn't send, sorry. Ring <a href='" + TEL + "'>" + PHONE + "</a> or email <a href='mailto:" + EMAIL + "'>" + EMAIL + "</a>.", "ce-err");
      });
    });
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
