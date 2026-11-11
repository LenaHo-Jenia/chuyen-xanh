"use client";
import { SOURCES } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const AUTHOR = "Hồ Lê Na";
export const REPO_URL = "https://github.com/LenaHo-Jenia/chuyen-xanh";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer>
      <div className="container foot-grid">
        <div className="foot-brand">
          <p className="foot-logo">Chuyển Xanh</p>
          <p>{t("footer.tagline")}</p>
        </div>
        <div>
          <h4>{t("footer.product")}</h4>
          <ul>
            <li><a href="#top">{t("footer.check")}</a></li>
            <li><a href="#cost">{t("footer.cost")}</a></li>
            <li><a href="#support">{t("footer.support")}</a></li>
            <li><a href="#faq">{t("footer.faq")}</a></li>
          </ul>
        </div>
        <div>
          <h4>{t("footer.data")}</h4>
          <ul>
            <li><a href={SOURCES.lez.url} target="_blank" rel="noopener">{t("footer.lez")}</a></li>
            <li><a href={SOURCES.nq68.url} target="_blank" rel="noopener">Nghị quyết 68/2026/NQ-HĐND</a></li>
            <li><a href={SOURCES.iqair.url} target="_blank" rel="noopener">IQAir World Air Quality Report 2024</a></li>
          </ul>
        </div>
      </div>
      <div className="container foot-bottom">
        <p>© 2026 Chuyển Xanh. {t("footer.by")} {AUTHOR}. <a href={REPO_URL} target="_blank" rel="noopener">GitHub</a></p>
        <p>{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
