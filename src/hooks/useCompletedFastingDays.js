import {useEffect, useState} from "react";

export const useCompletedFastingDays = () => {
    const [completedDays, setCompletedDays] = useState({})

    useEffect(() => {
        if (typeof window !== "undefined") {
            const completedFastingDaysData = localStorage.getItem("checkboxData");

            setCompletedDays(completedFastingDaysData ? JSON.parse(completedFastingDaysData) : {});
        }
    }, []);

    return {completedDays, setCompletedDays}
}