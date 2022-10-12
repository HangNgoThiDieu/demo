import { useTranslation } from "react-i18next";

const NoData = () => {
    const { t } = useTranslation();
    return (
        <p className="no_data">{t('noData')}</p>
    )
}

export default NoData;