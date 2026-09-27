import { Grid, GridColumn } from "@app/components/common/grid";
import clsx from "clsx";
import { motion } from "motion/react"
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRootLoaderData } from "@app/hooks/useRootLoaderData";
import { useI18n } from "@app/hooks/useI18n";

const DEFAULT_STORIES = {
  titleTop: {
    en: "THIS",
    vi: "ĐÂY LÀ",
  },
  titleBottom: {
    en: "IS Our",
    vi: "CỦA CHÚNG TÔI",
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

export default function Stories() {
  const { currentLanguage } = useI18n();
  const rootData = useRootLoaderData();
  const settings = rootData?.siteDetails?.settings || {};
  const isVi = currentLanguage === 'vi';

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

  const items = [
    {
      id: 'item-story',
      alt: "Story",
      image: "/assets/images/stories/stories.webp",
      className: "w-full h-[85vh] object-contain",
      classNameWrapper: "items-end",
      background: "/assets/images/stories/background-story.webp",
      text: storyText,
      classNameText: "font-montserrat font-medium text-xs lg:text-[18px] leading-[28.24px] text-center lg:w-[630px] w-[90vw] px-5 py-2 rotate-[-6deg]",
      classNameTextWrapper: "lg:left-[20%] left-[0%] lg:top-[30vh] top-[40vh]",
      items: [
        { src: '/assets/images/stories/items/story-1.webp', className: 'top-1/2 -translate-y-1/2 left-0 h-[16vh] object-contain' },
        { src: '/assets/images/stories/items/story-2.webp', className: 'top-[30vh] left-[10%] h-[20vh] object-contain' },
        { src: '/assets/images/stories/items/story-3.webp', className: 'top-[25vh] right-[10%] h-[19vh] object-contain' },
        { src: '/assets/images/stories/items/story-4.webp', className: 'top-[75vh] right-[10%] h-[25vh] object-contain' },
        { src: '/assets/images/stories/items/story-5.webp', className: 'top-[65vh] right-[3%] h-[18vh] object-contain' },
        { src: '/assets/images/stories/items/story-6.webp', className: 'top-[55vh] right-[-5%] h-[20vh] object-contain' },
      ]
    },
    {
      id: 'item-mission',
      alt: "Mission",
      image: "/assets/images/stories/mission.webp",
      className: "w-full h-[85vh] object-contain",
      classNameWrapper: "",
      background: "/assets/images/stories/background-mission.webp",
      text: missionText,
      classNameText: "font-montserrat font-medium text-xs lg:text-[18px] leading-[28.24px] text-center lg:w-[630px] w-[90vw] px-5 py-2 rotate-[3deg]",
      classNameTextWrapper: "lg:left-[20%] left-[0%] lg:bottom-[10vh] bottom-[0vh]",
      items: [
        { src: '/assets/images/stories/items/mission-1.webp', className: 'top-[55vh] left-0 h-[20vh] object-contain' },
        { src: '/assets/images/stories/items/mission-2.webp', className: 'top-[52vh] left-[10%] h-[12vh] object-contain' },
        { src: '/assets/images/stories/items/mission-3.webp', className: 'top-[45vh] left-[17%] h-[18vh] object-contain' },
        { src: '/assets/images/stories/items/mission-4.webp', className: 'top-[5vh] left-[28%] h-[20vh] object-contain' },
        { src: '/assets/images/stories/items/mission-5.webp', className: 'top-[55vh] right-[15%] h-[18vh] object-contain' },
        { src: '/assets/images/stories/items/mission-6.webp', className: 'top-[30vh] right-0 h-[18vh] object-contain' },
      ]
    },
    {
      id: 'item-packaging',
      alt: "Packaging",
      image: "/assets/images/stories/packaging.webp",
      className: "w-full h-[80vh] object-contain",
      background: "/assets/images/stories/background-packaging.webp",
      classNameWrapper: "items-end",
      text: packagingText,
      classNameText: "font-montserrat font-medium text-xs lg:text-[18px] leading-[28.24px] text-center lg:w-[830px] w-[90vw] text-white px-5 py-2 rotate-[-5deg]",
      classNameTextWrapper: "lg:right-[12vh] right-[2%] lg:top-[40vh] top-[50vh]",
      items: [
        { src: '/assets/images/stories/items/pack-1.webp', className: 'top-[60vh] left-[-10%] h-[20vh] object-contain' },
        { src: '/assets/images/stories/items/pack-2.webp', className: 'top-[55vh] left-[3%] h-[12vh] object-contain' },
        { src: '/assets/images/stories/items/pack-3.webp', className: 'top-[46vh] left-[17%] h-[11vh] object-contain' },
        { src: '/assets/images/stories/items/pack-4.webp', className: 'top-[31vh] left-[25%] h-[15vh] object-contain' },
        { src: '/assets/images/stories/items/pack-5.webp', className: 'top-[7vh] left-1/2 h-[18vh] object-contain' },
        { src: '/assets/images/stories/items/pack-6.webp', className: 'top-[33vh] right-[7%] h-[23vh] object-contain' },
      ]
    },
  ]
  const handleItemClick = (id: string) => {
    const element = document.getElementById(`item-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  };

  const handleBackClick = () => {
    const element = document.getElementById(`stories-container`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
    }
  };

  return (
    <motion.div
      id="stories-container"
      className={
        clsx(
          'min-h-screen w-[400vw] lg:w-auto lg:aspect-[1071/256] flex [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
        )
      }

      style={{ overflow: "hidden" }}
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >

      <div className="w-[100vw] lg:w-[15%] flex flex-col px-4 py-6 lg:px-[45px] lg:py-[32px]">
        <p className="font-title font-bold lg:text-8xl text-4xl">
          <span>{titleTop}</span> <br />
          <span className="lg:ml-[14px] ml-1">{renderBottomTitle(titleBottom)}</span>
        </p>
        <div className="flex flex-col gap-8 h-full flex-1 justify-center">
          {menu.map((item) => (
            <span onClick={() => handleItemClick(item.id)} key={item.id} className="font-title font-bold lg:text-[40px] text-2xl rounded-full border border-black mx-6 py-2 text-center hover:bg-[#FFE977] hover:border-[#FFE977] transition-all duration-300 ease-in-out cursor-pointer">
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="w-[300vw] lg:w-[85%] bg-white">
        <div className="w-full h-full bg-cover bg-center overflow-hidden relative">
          <Grid className="h-[100vh] bg-[url('/assets/images/stories/background.webp')] bg-cover bg-center">
            {items.map((item) => (
              <GridColumn id={item.id} key={item.alt} className={clsx('col-span-4 flex relative', item.classNameWrapper)}>
                <div className="group">
                  <img src={item.image} alt={item.alt} className={clsx(item.className)} />
                  <div className={clsx(
                    "w-full absolute opacity-100 transition-all duration-300 ease-in-out",
                    item.classNameTextWrapper
                  )}>
                    <p className={clsx(
                      'm-6 text-center z-10 absolute bottom-0 bg-center bg-repeat border border-[#000000] rounded-xl shadow-[0px_4px_10px_0px_#00000040] p-5',
                      item.classNameText,
                      `bg-${item.id}`
                    )}>{item.text}</p>
                  </div>
                </div>
                {item.items.map((icon) => (
                  <motion.img
                    animate={{
                      y: [0, 50, 0],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    src={icon.src} alt={item.alt} className={clsx('absolute', icon.className)} />
                ))}
              </GridColumn>
            ))}
          </Grid>

          <div className="fixed bottom-8 right-11">
            <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center" onClick={() => handleBackClick()}>
              <ChevronLeftIcon color="white" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
