"use client";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import AirSlider from "./AirSlider";
import Checker, { type CheckerProps } from "./Checker";

export default function Hero(props: CheckerProps) {
  const { t } = useI18n();
  const img = useRef<HTMLImageElement>(null);
  const haze = useRef<HTMLDivElement>(null);
  return (
    <header className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={img} src="https://images.unsplash.com/photo-1613131145282-9476375618e1?auto=format&fit=crop&w=2400&q=80" alt="" />
        <div className="haze" ref={haze} />
      </div>
      <div className="container hero-inner">
        <div>
          <h1>{t("hero.title")}</h1>
          <p className="sub">{t("hero.sub")}</p>
          <ul className="meta">
            <li><b>{t("hero.wards")}</b> {t("hero.wardsTail")}</li>
            <li>{t("hero.next")} <b>{t("hero.nextDate")}</b></li>
            <li>{t("hero.support")} <b>{t("hero.supportMax")}</b></li>
          </ul>
          <AirSlider img={img} haze={haze} />
        </div>
        <Checker {...props} />
      </div>
      <p className="credit">
        {t("hero.credit")}{" "}
        <a href="https://unsplash.com/photos/people-riding-motorcycle-on-road-near-building-during-daytime-6keOhd7idJo" target="_blank" rel="noopener">Elliot Andrews</a> / Unsplash
      </p>
    </header>
  );
}
