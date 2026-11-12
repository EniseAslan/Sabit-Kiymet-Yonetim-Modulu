export type KartTab = "genel" | "sube";

interface KartTabsProps {
  activeTab: KartTab;
  onTabChange: (tab: KartTab) => void;
}

function KartTabs({ activeTab, onTabChange }: KartTabsProps) {
  return (
    <div className="kart-tabs" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "genel"}
        className={`kart-tabs__tab ${
          activeTab === "genel" ? "kart-tabs__tab--active" : ""
        }`}
        onClick={() => onTabChange("genel")}
      >
        Genel Bilgiler
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "sube"}
        className={`kart-tabs__tab ${
          activeTab === "sube" ? "kart-tabs__tab--active" : ""
        }`}
        onClick={() => onTabChange("sube")}
      >
        Şube Bilgileri
      </button>
    </div>
  );
}

export default KartTabs;
