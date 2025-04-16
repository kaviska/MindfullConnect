import React from "react";
import { FileTypeItem } from "./types";

export const ProfileSidebar: React.FC = () => {
  const fileTypes: FileTypeItem[] = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/45012f985157b6a2bb2eb3c089fa0252ae7920f8?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c",
      type: "Documents",
      count: "180 files",
      size: "245mo",
      bgColor: "bg-emerald-50",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e1475378c000759dfa0d6d650bfbbc7be3f593f2?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c",
      type: "Photos",
      count: "1675 files",
      size: "300mo",
      bgColor: "bg-blue-50",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/81251504335c6b30490681a02bc68790bc2b2523?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c",
      type: "Vidéo",
      count: "12 files",
      size: "902mo",
      bgColor: "bg-slate-100",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c12b87b5b1404be5121fcd3fde62de4e770c08b5?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c",
      type: "Audio",
      count: "08 files",
      size: "124mo",
      bgColor: "bg-blue-100",
    },
  ];

  return (
    <aside className="self-stretch pt-16 pb-32 my-auto bg-white rounded-none border-l border-indigo-100 border-solid border-l-[color:var(--Primary-P7,#E5EAFF)] min-h-[805px] min-w-60 w-[295px]">
      <header className="flex flex-col items-center pb-8 w-full text-center">
        <div className="flex w-12 h-12 bg-red-200 min-h-12 rounded-[100.75px]" />
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-lg font-bold leading-loose text-neutral-900">
            Jean-Eude Cokou
          </h2>
          <p className="text-base font-medium leading-7 text-neutral-400">
            Web develeper
          </p>
        </div>
      </header>

      <section className="flex flex-col items-center w-full">
        <div className="w-full max-w-[275px]">
          <div className="flex gap-3 items-start w-full tracking-wide text-center">
            <article className="flex flex-col flex-1 shrink items-start py-2 pr-1.5 pl-2 rounded-lg basis-0">
              <h3 className="text-base font-extrabold text-neutral-900">29</h3>
              <p className="mt-3 text-xs font-medium text-neutral-400">
                In Progress
              </p>
            </article>
            <article className="flex flex-col flex-1 shrink items-start p-2 whitespace-nowrap rounded-lg basis-0">
              <h3 className="text-base font-extrabold text-neutral-900">17</h3>
              <p className="mt-3 text-xs font-medium text-neutral-400">Ready</p>
            </article>
            <article className="flex flex-col flex-1 shrink items-start p-2 rounded-lg basis-0">
              <h3 className="text-base font-extrabold text-neutral-900">120</h3>
              <p className="mt-3 text-xs font-medium text-neutral-400">
                All task
              </p>
            </article>
          </div>

          <section className="mt-6 w-full">
            <div className="flex gap-10 justify-between items-start w-full leading-snug">
              <h3 className="text-sm text-neutral-400">Media (31)</h3>
              <button className="text-xs font-bold text-blue-900 underline">
                See All
              </button>
            </div>
            <div className="mt-2 w-full">
              <div className="flex gap-1 items-start w-full">
                <div className="flex flex-1 shrink rounded-sm basis-0 h-[63px] w-[89px]" />
                <div className="flex flex-1 shrink basis-0 h-[63px] w-[89px]" />
                <div className="flex flex-1 shrink basis-0 h-[63px] w-[89px]" />
              </div>
              <div className="flex gap-1 items-start mt-1 w-full text-lg font-bold leading-snug text-indigo-100 whitespace-nowrap">
                <div className="flex flex-1 shrink basis-0 h-[63px] w-[89px]" />
                <div className="flex flex-1 shrink basis-0 h-[63px] w-[89px]" />
                <div className="flex-1 shrink px-px basis-0">
                  <div className="px-7 py-5 rounded-sm bg-blue-900 bg-opacity-70">
                    +26
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 w-full">
            <div className="flex gap-10 justify-between items-start w-full leading-snug">
              <h3 className="text-sm text-neutral-400">File type (6)</h3>
              <button className="text-xs font-bold text-blue-900 underline">
                See All
              </button>
            </div>
            <div className="mt-2 w-full">
              {fileTypes.map((fileType) => (
                <article
                  key={fileType.type}
                  className="flex gap-1 items-center mt-2 w-full"
                >
                  <div className="flex flex-1 shrink gap-2.5 items-center self-stretch my-auto basis-0 min-w-60">
                    <div
                      className={`flex gap-2.5 items-center self-stretch p-2 my-auto w-8 h-8 ${fileType.bgColor} rounded`}
                    >
                      <img
                        src={fileType.icon}
                        className="object-contain w-4 aspect-square"
                        alt={fileType.type}
                      />
                    </div>
                    <div className="self-stretch my-auto text-slate-600">
                      <h4 className="text-xs font-semibold">{fileType.type}</h4>
                      <p className="text-xs">{`${fileType.count}, ${fileType.size}`}</p>
                    </div>
                  </div>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/33ddd38d87fa0151a741944e0b6a1e0834b3017f?placeholderIfAbsent=true&apiKey=fd0c2c04ade54c2997bae3153b14309c"
                    className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                    alt="More options"
                  />
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </aside>
  );
};
