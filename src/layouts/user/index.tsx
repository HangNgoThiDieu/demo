import i18n from 'config/i18n';
import { useAuth } from 'context/auth';
import HeaderUser from 'layouts/headerUser';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { transactionService } from 'services/transaction.service';
import { TransactionInfo } from 'types/models/trans-info.model';
import { ColorsResult } from 'types/results/colors.result';
import { COLORS, CURRENCY_UNITS, FLAG_CODES, LANGUAGE_USER, TRANSACTION_INFO, TRANSLATE_LIST } from 'utils';
import { tokenHelper } from 'utils/store-token';

interface UserProps {
  isOrderHistory?: any;
}

const UserContext = React.createContext<UserProps>({} as UserProps);

const UserLayout = ({ children }: any) => {
  const { t } = useTranslation();
  const { setter } = useAuth();
  const [lang, setLang] = useState(FLAG_CODES.JP);
  const [logo, setLogo] = useState('');
  const [isOrderHistory, setIsOrderHistory] = useState();
  const history = useHistory();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();
  let transactionId: number = Number(query.get("transId")!);
  let companyId: number = Number(query.get("comId")!);

  const [transId, setTransId] = useState<number>(transactionId);
  const [comId, setComId] = useState<number>(companyId);

  useEffect(() => {
    let transId = 0;
    let comId = 0;
    // check exist in cookies storage before
    const transactionInfo = tokenHelper.getPropertyFromStorage(TRANSACTION_INFO);

    if (transactionInfo == null) {
      if (transactionId !== 0 && companyId !== 0) {
        const transInfo = {
          com: companyId,
          trans: transactionId
        } as TransactionInfo

        tokenHelper.setPropertyToStorage(TRANSACTION_INFO, JSON.stringify(transInfo));
        transId = transactionId;
        comId = companyId;
      }
    }
    else {
      if ((transactionId !== 0 && companyId !== 0) 
          && (transactionId !== transactionInfo.trans || companyId !== transactionInfo.com)) {
        const transInfo = {
          com: companyId,
          trans: transactionId
        } as TransactionInfo

        tokenHelper.setPropertyToStorage(TRANSACTION_INFO, JSON.stringify(transInfo));
        transId = transactionId;
        comId = companyId;
      }
      else {
        transId = transactionInfo.trans;
        comId = transactionInfo.com;
      }
    }

    setTransId(transId);
    setComId(comId);

    const getInfoCompanyByTransaction = async () => {
      try {
        var compInfo = await transactionService.getCompanyInfoByTransaction(transId, comId);
        // set store name for header
        tokenHelper.setCompanyName(compInfo.companyName);
        let compName =  document.getElementById("compName");
        if (compName) {
          compName.textContent = compInfo.companyName;
        }
        // set logo
        setLogo(compInfo.logoCompany);
        // set color system
        if (compInfo.mainColor || compInfo.subColor || compInfo.textColor || compInfo.accentColor) {
          const colorsResult: ColorsResult = {
            mainColor: compInfo.mainColor,
            subColor: compInfo.subColor,
            textColor: compInfo.textColor,
            accentColor: compInfo.accentColor
          };
          tokenHelper.setColorsToStorage(COLORS, colorsResult);
          setter(colorsResult);
        }
        // set language for system
        let languageExist = tokenHelper.getLanguageFromStorage(LANGUAGE_USER);
        if (languageExist == undefined) {
          let language = TRANSLATE_LIST.filter((x) => x.key == compInfo.language).map((y) => y.value).shift();
          tokenHelper.setLanguageToStorage(LANGUAGE_USER, language);
          i18n.changeLanguage(tokenHelper.getLanguageFromStorage(LANGUAGE_USER));
          setLang(language as string);
        }
        else {
          i18n.changeLanguage(tokenHelper.getLanguageFromStorage(LANGUAGE_USER));
          setLang(languageExist as string);
        }
        // set currencyUnit for
        tokenHelper.setPropertyToStorage(CURRENCY_UNITS, compInfo.currencyUnit);
      }
      catch (err) {
        toast.error(t("user.top.transaction.errors.errorMessage"));
      }
    };

    getInfoCompanyByTransaction();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [history.location.pathname]);

  const userContext = React.useMemo(
    () => ({
      isOrderHistory: setIsOrderHistory
    }),
    [],
  );

  return (
    <div>
      <HeaderUser lang={lang} logo={logo} 
        isOrderHistory={isOrderHistory}
        transId={transId}
        comId={comId}
      />
      <main>
        <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
      </main>
    </div>
  )
}

export default UserLayout;

export const useUserContext = () => React.useContext<UserProps>(UserContext);