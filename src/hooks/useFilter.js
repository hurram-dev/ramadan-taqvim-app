import {useCallback, useState} from "react";
import {filterRegions} from "@/constants/filterRegions";

export default function useFilter () {
    const [filter, setFilter] = useState(null);
    const [country, setCountry] = useState('uz')


    const onFilterByRegionSelected = useCallback((e) => {
        const selectedRegion = filterRegions.find((region) => region.id === Number(e.target?.value))
        setCountry(selectedRegion.country)
        setFilter(selectedRegion)
    }, [filterRegions])

    return {filter, onFilterByRegionSelected, filterRegions, country}
}
