// Footer.js
import React from "react";
import "./Footer.css";

export default function ZooFooter() {
  return (
    <footer className="zoo-footer">
       {/* Điều khoản */}
  <section className="zoo-footer__terms">
    <div className="zoo-footer__container">
      <h3 className="zoo-footer__terms-title">Một số lưu ý và Điều Khoản</h3>
      <p>
        Rất tiếc, một số khách sẽ không thể tham gia do các lý do sức khỏe như:
        chứng sợ động vật, dị ứng đã biết trước, hoặc hệ miễn dịch suy giảm.
      </p>
      <p>
        Dù chúng tôi luôn cố gắng hỗ trợ người khuyết tật hoặc gặp khó khăn trong học tập,
        nhưng vì các yêu cầu về an toàn và vận hành, có thể một số trường hợp không thể đáp ứng.
        Vui lòng liên hệ trước khi mua vé nếu bạn thuộc đối tượng này.
      </p>
      <p>
        Trải nghiệm này dành cho người lớn và trẻ em trên 12 tuổi.
        Trẻ từ 12 đến 15 tuổi bắt buộc phải có người lớn đi cùng (không cần tham gia, chỉ cần quan sát).
      </p>
    </div>
  </section>
      {/* Newsletter */}
      <section className="zoo-footer__newsletter">
        <div className="zoo-footer__container">
          <h3 className="zoo-footer__title">Hãy là người đầu tiên biết</h3>
          <p className="zoo-footer__lead">
            Nhận tin tức mới nhất về động vật và cập nhật từ ZozoLand bằng cách đăng ký bản tin.
          </p>

          <div className="zoo-footer__subscribe-card">
            <form
              className="zoo-footer__form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Cảm ơn bạn đã đăng ký!");
              }}
            >
              <div className="zoo-footer__inputs">
                <input type="text" placeholder="Họ" />
                <input type="text" placeholder="Tên" />
                <input type="email" placeholder="Email" required />
              </div>

              <label className="zoo-footer__consent">
                <input type="checkbox" defaultChecked />
                <span>
                  Cập nhật tin tức mới nhất về sở thú, các sự kiện sắp tới, chương trình giảm giá và hoạt động gây quỹ.
                </span>
              </label>

              <button className="zoo-footer__btn" type="submit">Đăng ký</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Main */}
      <section className="zoo-footer__main">
        <div className="zoo-footer__container zoo-footer__grid">
          {/* Brand */}
          <div className="zoo-footer__brand">
            <a href="/" className="zoo-footer__logo">
              <img src="logo.svg" alt="ZozoLand Logo" />
              {/* <div className="zoo-footer__logo-mark">C</div>
              <div className="zoo-footer__logo-text">
                <strong>Chester</strong>
                <span>Zoo</span>
              </div> */}
            </a>

            <ul className="zoo-footer__social">
              <li><a href="#"><SvgX /></a></li>
              <li><a href="#"><SvgInstagram /></a></li>
              <li><a href="#"><SvgFacebook /></a></li>
              <li><a href="#"><SvgYoutube /></a></li>
              <li><a href="#"><SvgLinkedin /></a></li>
            </ul>

            <p className="zoo-footer__copyright">
              © ZozoLand.<br />
              Bản quyền thuộc về ZozoLand Limited 2025.
            </p>
          </div>

          {/* Link Columns */}
          <nav className="zoo-footer__links">
            <div className="zoo-footer__linkcol">
              <h4>Liên hệ</h4>
              <a href="#">About ZozoLand</a>
              <a href="#">News</a>
              <a href="#">Careers</a>
              <a href="#">Support our charity</a>
              <a href="#">Corporate info</a>
              <a href="#">Contact us</a>
              <a href="#">Sustainability</a>
            </div>

            <div className="zoo-footer__linkcol">
              <h4>Thông tin</h4>
              <a href="#">Conservation Academy</a>
              <a href="#">Centre for Zoo Science</a>
              <a href="#">For students</a>
              <a href="#">For partners</a>
              <a href="#">For members</a>
              <a href="#">Press & media</a>
            </div>
          </nav>

          {/* Badges */}
          <div className="zoo-footer__badges">
            <h5>Sở thú hiện đại nhất Việt Nam</h5>
            <div className="zoo-footer__badges-row">
              <img src="/assets/badge-1.png" alt="Traveller's Choice" />
              <img src="/assets/badge-2.png" alt="Gold Award 2023-24" />
              <img src="/assets/badge-3.png" alt="Visit England Award" />
            </div>
          </div>
        </div>

        <div className="zoo-footer__container zoo-footer__legal">
          <a href="#">Cookie policy</a>
          <a href="#">Privacy policy</a>
          <a href="#">Terms & conditions</a>
          <a href="#">Modern slavery statement</a>
          <a href="#">Cookie settings</a>
        </div>
      </section>
    </footer>
  );
}

/* === SVG icons (vẫn inline, không dùng lib) === */
function SvgX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function SvgInstagram() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
    </svg>
  );
}
function SvgFacebook() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9z" fill="currentColor"/>
    </svg>
  );
}
function SvgYoutube() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M23 12s0-4-1-5-2-1-5-1H7C4 6 3 6 2 7s-1 5-1 5 0 4 1 5 2 1 5 1h10c3 0 4 0 5-1s1-5 1-5z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
    </svg>
  );
}
function SvgLinkedin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="6.5" y="9.5" width="2.5" height="8" fill="currentColor"/>
      <circle cx="7.8" cy="7.2" r="1.2" fill="currentColor"/>
      <path d="M13 17.5v-4.2c0-1.6 1.3-2.8 2.8-2.8s2.7 1.2 2.7 2.8v4.2h-2.5v-4c0-.6-.4-1.1-1-1.1s-1 .5-1 1.1v4h-1z" fill="currentColor"/>
    </svg>
  );
}
