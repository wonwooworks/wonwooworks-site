(function () {
    'use strict';

    var FORM_ENDPOINT = '';

    var $ = function (sel) { return document.querySelector(sel); };
    var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

    var BUSINESSES = {
        bakery: {
            label: '빵집', query: '동네 빵집', name: 'OO베이커리', title: 'OO베이커리 — 매일 아침 굽는 동네 빵집',
            desc: '오늘 나온 빵과 영업시간을 바로 확인하세요. 예약 주문은 전화로 받아요.',
            status: '영업 중 · 20:00까지', cta1: '전화 주문', cta2: '길찾기', tint: '#E9DCC8', domain: 'www.oo-bakery.kr'
        },
        restaurant: {
            label: '식당', query: '동네 고깃집', name: 'OO식당', title: 'OO식당 — 숯불 돼지갈비 전문',
            desc: '오늘 영업시간과 대표 메뉴, 주차 안내를 한눈에. 단체 예약은 전화로 받아요.',
            status: '영업 중 · 22:00까지', cta1: '전화 예약', cta2: '길찾기', tint: '#F1DDD3', domain: 'www.oo-sikdang.kr'
        },
        hair: {
            label: '미용실', query: '동네 미용실 예약', name: 'OO헤어', title: 'OO헤어 — 커트·펌 예약은 카톡으로',
            desc: '디자이너별 가능한 시간을 보고 카카오톡으로 바로 예약하세요.',
            status: '영업 중 · 21:00까지', cta1: '카톡 예약', cta2: '길찾기', tint: '#D9E2EC', domain: 'www.oo-hair.kr'
        },
        studio: {
            label: '공방', query: '주말 원데이 클래스', name: 'OO공방', title: 'OO공방 — 주말 원데이 클래스',
            desc: '이번 주 남은 자리와 준비물을 한눈에. 2인 이상은 미리 문의해 주세요.',
            status: '오늘 클래스 2자리 남음', cta1: '자리 문의', cta2: '길찾기', tint: '#DDE7DA', domain: 'www.oo-studio.kr'
        },
        academy: {
            label: '학원', query: '초등 영어학원', name: 'OO학원', title: 'OO학원 — 초등 영어 소수정예',
            desc: '반별 시간표와 상담 가능한 시간을 확인하고 바로 상담을 예약하세요.',
            status: '상담 가능 · 평일 14–19시', cta1: '상담 예약', cta2: '시간표', tint: '#E6DDEC', domain: 'www.oo-academy.kr'
        },
        office: {
            label: '1인 사무실', query: '개인사업자 세무 상담', name: 'OO세무사무소', title: 'OO세무사무소 — 개인사업자 세무 상담',
            desc: '처음 상담 전에 준비할 서류와 상담 방법을 안내해 드려요.',
            status: '평일 09–18시 상담', cta1: '상담 신청', cta2: '준비 서류', tint: '#E3E5E0', domain: 'www.oo-tax.kr'
        }
    };

    var journey = $('#journey');
    var chips = $$('.chip');

    function showBusiness(key, announceIt) {
        var b = BUSINESSES[key];
        if (!b || !journey) return;
        journey.querySelectorAll('[data-f]').forEach(function (el) { el.textContent = b[el.dataset.f]; });
        journey.style.setProperty('--tint', b.tint);
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.biz === key ? 'true' : 'false'); });
        if (announceIt) $('#biz-live').textContent = b.label + ' 예시로 바뀌었어요.';
    }

    chips.forEach(function (c) {
        c.addEventListener('click', function () { showBusiness(c.dataset.biz, true); });
    });
    showBusiness('bakery', false);

    var navLinks = $$('.navlink');
    if ('IntersectionObserver' in window) {
        var linkFor = {};
        navLinks.forEach(function (a) { linkFor[a.getAttribute('href').slice(1)] = a; });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
                var link = linkFor[entry.target.id];
                if (link) link.setAttribute('aria-current', 'location');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        $$('main section[id]').forEach(function (sec) { observer.observe(sec); });
    }

    var form = $('#contact-form');
    var done = $('#form-done');
    var submitBtn = $('#form-submit');
    var fields = [
        { input: $('#f-name'), error: $('#f-name-err') },
        { input: $('#f-contact'), error: $('#f-contact-err') }
    ];

    var agree = $('#f-agree');
    var agreeErr = $('#f-agree-err');

    function setAgreeError(on) {
        agreeErr.hidden = !on;
        agree.setAttribute('aria-invalid', on ? 'true' : 'false');
        if (on) agree.setAttribute('aria-describedby', agreeErr.id);
        else agree.removeAttribute('aria-describedby');
    }

    agree.addEventListener('change', function () {
        if (agree.checked) setAgreeError(false);
    });

    function setError(f, on) {
        f.error.hidden = !on;
        f.input.setAttribute('aria-invalid', on ? 'true' : 'false');
        if (on) f.input.setAttribute('aria-describedby', f.error.id);
        else f.input.removeAttribute('aria-describedby');
    }

    fields.forEach(function (f) {
        f.input.addEventListener('input', function () {
            if (f.input.getAttribute('aria-invalid') === 'true') setError(f, !f.input.value.trim());
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstInvalid = null;
        fields.forEach(function (f) {
            var bad = !f.input.value.trim();
            setError(f, bad);
            if (bad && !firstInvalid) firstInvalid = f.input;
        });
        setAgreeError(!agree.checked);
        if (!agree.checked && !firstInvalid) firstInvalid = agree;
        if (firstInvalid) { firstInvalid.focus(); return; }
        $('#form-error').hidden = true;

        var showDone = function () {
            form.hidden = true;
            done.hidden = false;
            done.querySelector('.btn').focus();
        };

        if (!FORM_ENDPOINT) { showDone(); return; }

        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = '보내는 중…';

        fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
            .then(function (res) { if (!res.ok) throw new Error(res.status); showDone(); })
            .catch(function () { $('#form-error').hidden = false; })
            .then(function () {
                submitBtn.disabled = false;
                submitBtn.removeAttribute('aria-busy');
                submitBtn.textContent = '상담 신청하기 →';
            });
    });

    $('#form-reset').addEventListener('click', function () {
        form.reset();
        fields.forEach(function (f) { setError(f, false); });
        setAgreeError(false);
        done.hidden = true;
        form.hidden = false;
        fields[0].input.focus();
    });
})();