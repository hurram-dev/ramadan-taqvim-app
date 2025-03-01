'use client'
import {useCallback, useState} from "react";
import ReactModal from "react-modal";
import { IoMdClose } from "react-icons/io";
import DuaModal from "@/app/components/DuaModal";
import useSWR from "swr";
import {fetcher} from "@/utils/fetcher";
import useFilter from "@/hooks/useFilter";
import {getComputedTime} from "@/utils/taqvimTableUtils";
import dayjs from "dayjs";
import 'dayjs/locale/uz-latn'
import Link from "next/link";
import {useCompletedFastingDays} from "@/hooks/useCompletedFastingDays";


const duaList = {
    MORNING: {
        content: 'Navaytu an asuma sovma shahri ramazona minal fajri ilal mag\'ribi, xolisan lillahi ta\'ala.\n' +
            'Allohu akbar.',
        title: 'Saharlik Duosi',
        definition: `Ramazon oyining ro'zasini xolis Alloh uchun subhdan to kun botguncha tutmoqni niyat qildim. Alloh buyukdir.`,
        original: `نَوَيْتُ أَنْ أَصُومَ صَوْمَ شَهْرَ رَمَضَانَ مِنَ الْفَجْرِ إِلَى الْمَغْرِبِ، خَالِصًا لِلهِ تَعَالَى أَللهُ أَكْبَرُ`,
        audioSrc: '/dua_sahar.mp3'
    },
    EVENING: {
        content: `Allohumma laka sumtu va bika aamantu va a’layka tavakkaltu va a’laa rizqika aftartu, 
        fag‘firliy ma qoddamtu va maa axxortu birohmatika yaa arhamar roohimiyn.`,
        title: 'Iftorlik Duosi',
        definition: `Ey Alloh, ushbu Ro‘zamni Sen uchun tutdim va Senga iymon keltirdim va Senga tavakkal qildim va bergan rizqing bilan iftor qildim. 
        Ey mehribonlarning eng mehriboni, mening avvalgi va keyingi gunohlarimni mag‘firat qilgil.`,
        original: `اَللَّهُمَّ لَكَ صُمْتُ وَ بِكَ آمَنْتُ وَ عَلَيْكَ تَوَكَّلْتُ وَ عَلَى رِزْقِكَ أَفْتَرْتُ، فَغْفِرْلِى مَا قَدَّمْتُ وَ مَا أَخَّرْتُ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَُ`,
        audioSrc: '/dua_iftar.mp3'
    }
}

export default function Banner () {
    const [duaModal, setDuaModal] = useState(null)
    const onDuaClickHandler = useCallback((type) => {
        setDuaModal(duaList?.[type])
    }, [duaList])

    const onCloseDuaModalHandler = useCallback(() => {
        setDuaModal(null)
    }, [])


    const {filterRegions, onFilterByRegionSelected, filter, country} = useFilter()
    const {data, isLoading} = useSWR(`/api/taqvim?query=today&country=${country}`, fetcher)
    const {completedDays} = useCompletedFastingDays()

    const totalCompletedFastingDays = Object.values(completedDays ?? {}).filter((value) => value).length

    return <div
        className='home__banner h-screen xl:h-[40rem] backdrop-blur-xl w-full bg-center bg-no-repeat bg-cover'
        style={{backgroundImage: 'url(/taqvim-app-wallpaper.webp)'}}>
        <div className="container h-full mx-auto px-4 py-6 flex flex-col justify-center items-center">
            <select
                defaultValue={0}
                onChange={onFilterByRegionSelected}
                className="form-select md:w-[30rem] w-full mb-3 mx-2
            py-1.5 text-base font-normal text-gray-700 bg-white
            border border-solid border-gray-300 rounded"
                aria-label="Filter by Region"
            >
                {filterRegions.map((region, index) => (
                    <option key={index} value={region.id}>
                        {region?.name}
                    </option>
                ))}
            </select>
            <div className="home-banner__today  w-full flex md:flex-row flex-col md:gap-x-3 gap-y-3 justify-center">
                <div className="today__item shadow-2xl md:w-[15rem]f bg-white rounded-xl px-4 py-3 text-center">
                    <h3 className='today-item__title font-semibold bg-green-700 p-2 rounded-lg text-white'>Bugungi
                        Saharlik
                        Vaqti</h3>
                    <div className='today-item__time font-extrabold text-green-700 text-6xl mt-1'>
                        {!isLoading && data ? getComputedTime(data?.date, filter, data?.time?.morning, 'MORNING')
                            : '...'}
                    </div>
                    <p className='font-medium text-green-700 text-xl mt-0.5'>{dayjs().locale('uz-latn').format('D MMMM, YYYY')}</p>
                    <button
                        onClick={() => onDuaClickHandler('MORNING')}
                        className="today-item__button font-semibold mt-2.5 px-4 py-2 rounded-full border-2 border-green-700 bg-white text-green-500 shadow-xl">
                        Saharlik Duosi
                    </button>
                </div>
                <div className="today__item shadow-2xl md:w-[15rem] bg-white rounded-xl px-4 py-3 text-center">
                    <h3 className='today-item__title font-semibold bg-green-700 p-2 rounded-lg text-white'>Bugungi
                        Iftorlik
                        Vaqti</h3>
                    <div className='today-item__time font-extrabold text-green-700 text-6xl mt-1'>
                        {!isLoading && data ? getComputedTime(data?.date, filter, data?.time?.evening, 'EVENING') : '...'}
                    </div>
                    <p className='font-medium text-green-700 text-xl mt-0.5'>{dayjs().locale('uz-latn').format('D MMMM, YYYY')}</p>
                    <button
                        onClick={() => onDuaClickHandler('EVENING')}
                        className="today-item__button font-semibold mt-2.5 px-4 py-2 rounded-full border-2 border-green-700 bg-white text-green-500 shadow-xl">
                        Iftorlik Duosi
                    </button>
                </div>
            </div>
            <div className="home-completed-days__wrapper w-full mt-3 flex items-center justify-center">
                <div className="bg-white md:w-[30rem] w-full rounded px-2 py-2.5 text-gray-400 font-semibold md:font-medium">
                    Siz
                    <Link
                    className="font-semibold md:font-medium mx-1 mt-2.5 text-xl text-green-500 shadow-xl"
                    href='/full-taqvim'>
                        {totalCompletedFastingDays}
                    </Link>
                    kun ro'za tutdingiz, tutilgan kunlarni hisoblab borish uchun

                     <Link
                        className="font-semibold ml-1 mt-2.5 text-green-500 shadow-xl"
                        href='/full-taqvim'>
                         hisoblash
                    </Link> ni bosing.
                </div>
            </div>
            <ReactModal
                isOpen={Boolean(duaModal)}
                preventScroll
                style={{content: { height: '20rem'}}}
                ariaHideApp={false}
                onRequestClose={onCloseDuaModalHandler}
                className="w-full md:w-[30rem] m-auto rounded-lg fixed inset-0 bg-white overflow-auto p-3.5"
                overlayClassName=""
            >
                <div className='relative mb-5'>
                    <IoMdClose onClick={onCloseDuaModalHandler}
                               className='sticky top-0 text-2xl cursor-pointer text-end right-0'/>
                </div>
                <DuaModal duaModal={duaModal}/>
            </ReactModal>
        </div>
    </div>
}
