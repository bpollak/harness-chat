// The character clips have see-through backgrounds. Safari plays the .mov version with transparency;
// other browsers play the .webm version. Anyone who prefers less motion gets a still picture.
(function () {
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ua = navigator.userAgent;
  var webkit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg\/|OPR\/|Android/.test(ua);
  var ext = webkit ? 'mov' : 'webm';

  function show(el, clip) {
    el.dataset.clip = clip;
    el.textContent = '';
    var still = document.createElement('img');
    still.src = 'assets/' + clip + '.png';
    still.alt = '';
    el.appendChild(still);
    if (calm) return;
    var video = document.createElement('video');
    video.muted = true; video.loop = true; video.playsInline = true; video.autoplay = true;
    video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('aria-hidden', 'true');
    video.preload = 'auto';
    video.addEventListener('playing', function () { still.style.visibility = 'hidden'; }, { once: true });
    video.addEventListener('error', function () { video.remove(); });
    video.src = 'assets/' + clip + '.' + ext;
    el.appendChild(video);
    var start = video.play();
    if (start && start.catch) start.catch(function () {});
  }

  document.querySelectorAll('.mascot[data-clip]').forEach(function (el) { show(el, el.dataset.clip); });

  // The sample conversation in the phone.
  var answers = {
    trip: '<p>You file an expense report after the trip. In short:</p><ol><li>Keep your receipts and the conference agenda.</li><li>Create an expense report in the campus travel system and attach them.</li><li>Submit it for your approver. Payment follows by direct deposit.</li></ol><p>Source: Travel on Blink</p>',
    agenda: '<p>Here is a simple agenda you can adapt:</p><ol><li>Welcome and purpose of the meeting</li><li>Quick updates from each person</li><li>Main topic or decision to discuss</li><li>Roadblocks and questions</li><li>Next steps, owners and dates</li></ol><p>Tell me the topic and I can tailor it.</p>',
    email: '<p>Here is a draft you can copy:</p><p><strong>Subject:</strong> Timesheets due Friday</p><p>Hi team,<br>A quick reminder that timesheets are due this Friday. Please submit yours by end of day so approvals can go through on time.<br>Thank you!</p><p>Nothing has been sent.</p>'
  };
  var chat = document.getElementById('demoChat');
  var status = document.getElementById('demoStatus');
  var mascot = document.getElementById('demoMascot');
  var chips = document.querySelectorAll('#demoChips button');
  if (!chat) return;

  function say(cls, html) {
    var hint = document.getElementById('demoHint');
    if (hint) hint.remove();
    var el = document.createElement('div');
    el.className = cls;
    el.innerHTML = html;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
  }
  function mood(clip, words) { show(mascot, clip); status.textContent = words; }
  function wait(ms) { return new Promise(function (done) { setTimeout(done, calm ? Math.min(ms, 500) : ms); }); }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.disabled = true; });
      say('me', chip.textContent);
      mood('working', 'Looking it up');
      wait(1900).then(function () { mood('making', 'Writing it up'); return wait(1900); })
        .then(function () {
          say('it', answers[chip.dataset.demo] + '<em>This is a sample answer.</em>');
          mood('celebrate', 'Done');
          return wait(2800);
        })
        .then(function () {
          mood('ready', 'Ready when you are');
          chips.forEach(function (c) { c.disabled = false; });
        });
    });
  });
})();
