"use client";
import { useI18n } from "@/lib/i18n";

export default function Band() {
  const { t } = useI18n();
  return (
    <figure className="band">
      <figcaption className="container"><p>{t("band.text")}</p></figcaption>
      <p className="credit">
        {t("band.credit")} <a href="https://unsplash.com/photos/red-bridge-over-river-surrounded-by-trees-7oAFzGyemco" target="_blank" rel="noopener">Harry Tran</a> / Unsplash
      </p>
    </figure>
  );
}
