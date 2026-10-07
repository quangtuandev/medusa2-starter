import clsx from "clsx";
import { motion } from "motion/react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRootLoaderData } from "@app/hooks/useRootLoaderData";
import { useI18n } from "@app/hooks/useI18n";

const DEFAULT_STORIES = {
  titleTop: {
    en: "THIS",
    vi: "THIS",
  },
  titleBottom: {
    en: "IS Our",
    vi: "IS Our",
  },
  storyLabel: {
    en: "STORY",
    vi: "CÂU CHUYỆN",
  },
  missionLabel: {
    en: "MISSION",
    vi: "SỨ MỆNH",
  },
  packagingLabel: {
    en: "PACKAGING",
    vi: "BAO BÌ",
  },
  storyText: {
    en: "Kira was born as a joyful sparkling fragrance, capturing the very essence of sunshine and laughter in every delicate spritz. Like a playful breeze on a warm day, our scents effortlessly invigorate the spirit, infusing the air with a sense of lightness and elegance.",
    vi: "Kira ra đời như một làn hương rực rỡ và tràn đầy niềm vui, ghi lại trọn vẹn sự ấm áp của ánh nắng và tiếng cười trong từng làn hương tinh tế. Như một làn gió vui tươi trong ngày nắng ấm, hương thơm của chúng tôi tiếp thêm sinh khí cho tâm hồn, mang lại cảm giác thanh thoát và đầy cuốn hút.",
  },
  missionText: {
    en: "Kira was born as a joyful sparkling fragrance, capturing the very essence of sunshine and laughter in every delicate spritz. Like a playful breeze on a warm day, our scents effortlessly invigorate the spirit, infusing the air with a sense of lightness and elegance.",
    vi: "Kira ra đời như một làn hương rực rỡ và tràn đầy niềm vui, ghi lại trọn vẹn sự ấm áp của ánh nắng và tiếng cười trong từng làn hương tinh tế. Như một làn gió vui tươi trong ngày nắng ấm, hương thơm của chúng tôi tiếp thêm sinh khí cho tâm hồn, mang lại cảm giác thanh thoát và đầy cuốn hút.",
  },
  packagingText: {
    en: "One special aspect of Kira is that the packaging is entirely made of paper and sugarcane bagasse, implementing an extremely eco-friendly approach to recycling and resource conservation to protect the environment. Specifically, the packaging for the perfume bottles in the first collection will be a paper cup used for daily coffee, which you might typically toss away right after use. However, at Kira, this paper cup will preserve memories and lasting joy for the user, without the feeling of being wasteful.",
    vi: "Điểm đặc biệt ở Kira là bao bì hoàn toàn từ giấy và bã mía, áp dụng phương pháp tái chế và bảo tồn tài nguyên vô cùng thân thiện để bảo vệ môi trường. Cụ thể, bao bì cho những chai nước hoa trong bộ sưu tập đầu tiên là chiếc cốc giấy dùng cho cà phê hằng ngày, thứ mà bạn thường bỏ đi ngay sau khi dùng. Tuy nhiên, tại Kira, chiếc cốc giấy này sẽ lưu giữ những kỷ niệm và niềm vui dài lâu mà không hề mang lại cảm giác lãng phí.",
  },
};

/**
 * Shared text card styling.
 * Below `lg` the card is capped in height and scrollable so a long paragraph can
 * never push the composition out of its screen; from `lg` up it grows freely.
 */
const TEXT_CARD_CLASS =
  "absolute z-10 bg-center bg-repeat text-center border border-[#000000] rounded-xl shadow-[0px_4px_10px_0px_#00000040] font-montserrat font-medium text-xs leading-[16px] px-5 py-3 max-h-[80%] overflow-y-auto";

export default function Stories() {
  const { currentLanguage } = useI18n();
  const rootData = useRootLoaderData();
  const settings = rootData?.siteDetails?.settings || {};
  const isVi = currentLanguage === 'vi';
  const [activeIndex, setActiveIndex] = useState(0);

  const getText = (viVal?: string, enVal?: string, defaultVi: string = "", defaultEn: string = "") => {
    if (isVi) {
      return viVal?.trim() || (enVal?.trim() ? enVal.trim() : defaultVi);
    }
    return enVal?.trim() || defaultEn;
  };

  const titleTop = getText(
    settings.stories_title_top_vi,
    settings.stories_title_top_en,
    DEFAULT_STORIES.titleTop.vi,
    DEFAULT_STORIES.titleTop.en
  );

  const titleBottom = getText(
    settings.stories_title_bottom_vi,
    settings.stories_title_bottom_en,
    DEFAULT_STORIES.titleBottom.vi,
    DEFAULT_STORIES.titleBottom.en
  );

  const storyLabel = getText(
    settings.stories_story_label_vi,
    settings.stories_story_label_en,
    DEFAULT_STORIES.storyLabel.vi,
    DEFAULT_STORIES.storyLabel.en
  );

  const missionLabel = getText(
    settings.stories_mission_label_vi,
    settings.stories_mission_label_en,
    DEFAULT_STORIES.missionLabel.vi,
    DEFAULT_STORIES.missionLabel.en
  );

  const packagingLabel = getText(
    settings.stories_packaging_label_vi,
    settings.stories_packaging_label_en,
    DEFAULT_STORIES.packagingLabel.vi,
    DEFAULT_STORIES.packagingLabel.en
  );

  const storyText = getText(
    settings.stories_story_text_vi,
    settings.stories_story_text_en,
    DEFAULT_STORIES.storyText.vi,
    DEFAULT_STORIES.storyText.en
  );

  const missionText = getText(
    settings.stories_mission_text_vi,
    settings.stories_mission_text_en,
    DEFAULT_STORIES.missionText.vi,
    DEFAULT_STORIES.missionText.en
  );

  const packagingText = getText(
    settings.stories_packaging_text_vi,
    settings.stories_packaging_text_en,
    DEFAULT_STORIES.packagingText.vi,
    DEFAULT_STORIES.packagingText.en
  );

  const renderBottomTitle = (text: string) => {
    const parts = text.trim().split(" ");
    if (parts.length <= 1) {
      return text;
    }
    const lastPart = parts.pop();
    return (
      <>
        {parts.join(" ")}{" "}
        <span className="font-centuryBook italic font-normal">{lastPart}</span>
      </>
    );
  };

  const menu = [
    { label: storyLabel, id: 'story' },
    { label: missionLabel, id: 'mission' },
    { label: packagingLabel, id: 'packaging' },
  ]

  /**
   * Every offset and size is expressed relative to its slide box, so the whole
   * composition always scales down into a single screen instead of overflowing it.
   */
  const items = [
    {
      id: 'item-story',
      alt: "Story",
      image: "/assets/images/stories/stories.webp",
      className: "w-full h-[85%] object-contain",
      text: storyText,
      classNameText: clsx(
        "top-[16%] left-[6%] w-[88vw] rotate-[-6deg]",
        "lg:top-[6%] lg:left-[20%] lg:w-[60%] lg:max-h-[88%] lg:text-[18px] lg:leading-[28.24px]"
      ),
      items: [
        { src: '/assets/images/stories/items/story-1.webp', className: 'top-1/2 -translate-y-1/2 left-0 h-[16%] object-contain' },
        { src: '/assets/images/stories/items/story-2.webp', className: 'top-[30%] left-[10%] h-[20%] object-contain' },
        { src: '/assets/images/stories/items/story-3.webp', className: 'top-[25%] right-[10%] h-[19%] object-contain' },
        { src: '/assets/images/stories/items/story-4.webp', className: 'top-[75%] right-[10%] h-[25%] object-contain' },
        { src: '/assets/images/stories/items/story-5.webp', className: 'top-[65%] right-[3%] h-[18%] object-contain' },
        { src: '/assets/images/stories/items/story-6.webp', className: 'top-[55%] right-[-5%] h-[20%] object-contain' },
      ]
    },
    {
      id: 'item-mission',
      alt: "Mission",
      image: "/assets/images/stories/mission.webp",
      className: "w-full h-[85%] object-contain",
      text: missionText,
      classNameText: clsx(
        "top-[20%] left-[6%] w-[88vw] rotate-[3deg]",
        "lg:top-[62%] lg:left-[20%] lg:w-[62%] lg:max-h-[36%] lg:text-[18px] lg:leading-[28.24px]"
      ),
      items: [
        { src: '/assets/images/stories/items/mission-1.webp', className: 'top-[55%] left-0 h-[20%] object-contain' },
        { src: '/assets/images/stories/items/mission-2.webp', className: 'top-[52%] left-[10%] h-[12%] object-contain' },
        { src: '/assets/images/stories/items/mission-3.webp', className: 'top-[45%] left-[17%] h-[18%] object-contain' },
        { src: '/assets/images/stories/items/mission-4.webp', className: 'top-[5%] left-[28%] h-[20%] object-contain' },
        { src: '/assets/images/stories/items/mission-5.webp', className: 'top-[55%] right-[15%] h-[18%] object-contain' },
        { src: '/assets/images/stories/items/mission-6.webp', className: 'top-[30%] right-0 h-[18%] object-contain' },
      ]
    },
    {
      id: 'item-packaging',
      alt: "Packaging",
      image: "/assets/images/stories/packaging.webp",
      className: "w-full h-[80%] object-contain",
      text: packagingText,
      classNameText: clsx(
        "top-[12%] left-[6%] w-[88vw] text-white rotate-[-5deg]",
        "lg:top-[9%] lg:left-[22%] lg:w-[74%] lg:max-h-[87%] lg:text-[18px] lg:leading-[28.24px]"
      ),
      items: [
        { src: '/assets/images/stories/items/pack-1.webp', className: 'top-[60%] left-[-10%] h-[20%] object-contain' },
        { src: '/assets/images/stories/items/pack-2.webp', className: 'top-[55%] left-[3%] h-[12%] object-contain' },
        { src: '/assets/images/stories/items/pack-3.webp', className: 'top-[46%] left-[17%] h-[11%] object-contain' },
        { src: '/assets/images/stories/items/pack-4.webp', className: 'top-[31%] left-[25%] h-[15%] object-contain' },
        { src: '/assets/images/stories/items/pack-5.webp', className: 'top-[7%] left-1/2 h-[18%] object-contain' },
        { src: '/assets/images/stories/items/pack-6.webp', className: 'top-[33%] right-[7%] h-[23%] object-contain' },
      ]
    },
  ]

  const total = items.length;

  const goToSlide = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), total - 1));
  };

  return (
    <div
      id="stories-container"
      className="absolute inset-0 flex flex-col overflow-hidden bg-white lg:flex-row"
    >
      {/* Navigation panel. On narrow *and* short screens (phones in landscape) it
          collapses into a compact bar so the slide keeps most of the screen. */}
      <div className="flex w-full shrink-0 flex-col px-4 py-4 lg:h-full lg:w-[35%] lg:px-[45px] lg:py-[32px] compact:flex-row compact:items-center compact:gap-3 compact:py-2">
        <p className="font-title font-bold leading-none text-4xl lg:text-[min(6.7vw,96px)] compact:text-2xl">
          <span>{titleTop}</span> <br />
          <span className="ml-1 lg:ml-[14px]">{renderBottomTitle(titleBottom)}</span>
        </p>
        <nav className="flex flex-col gap-3 lg:h-full lg:flex-1 lg:justify-center lg:gap-8 compact:flex-1 compact:flex-row compact:items-center compact:justify-end compact:gap-2">
          {menu.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => goToSlide(index)}
              aria-current={activeIndex === index ? "true" : undefined}
              className={clsx(
                "font-title font-bold text-2xl lg:text-[min(2.8vw,40px)] rounded-full border border-black mx-6 py-2 text-center cursor-pointer transition-all duration-300 ease-in-out whitespace-nowrap compact:mx-0 compact:px-3 compact:py-1 compact:text-base",
                activeIndex === index
                  ? "bg-[#FFE977] border-[#FFE977]"
                  : "hover:bg-[#FFE977] hover:border-[#FFE977]"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Slide viewport: exactly one slide per screen */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div
          className="flex h-full bg-[url('/assets/images/stories/background.webp')] bg-cover bg-center"
          style={{ width: `${total * 100}%` }}
          animate={{ x: `-${(activeIndex * 100) / total}%` }}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
        >
          {items.map((item) => (
            <div
              id={item.id}
              key={item.alt}
              className="relative h-full shrink-0 overflow-hidden"
              style={{ width: `${100 / total}%` }}
            >
              <img
                src={item.image}
                alt={item.alt}
                className={clsx("absolute bottom-0 left-0", item.className)}
              />
              <p className={clsx(TEXT_CARD_CLASS, item.classNameText, `bg-${item.id}`)}>
                {item.text}
              </p>
              {item.items.map((icon) => (
                <motion.img
                  key={icon.src}
                  animate={{
                    y: [0, 50, 0],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  src={icon.src}
                  alt=""
                  className={clsx('absolute', icon.className)}
                />
              ))}
            </div>
          ))}
        </motion.div>

        {activeIndex > 0 && (
          <div className="absolute bottom-28 right-6 z-20">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => goToSlide(activeIndex - 1)}
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              <ChevronLeftIcon color="white" className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
