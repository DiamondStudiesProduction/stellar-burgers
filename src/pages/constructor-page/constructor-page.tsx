import { AppDispatch, RootState, useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addBun } from '../../services/slice';

export const ConstructorPage: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, buns, mains, sauces } = useSelector(
    (store: RootState) => store.BurgerIngredients
  );
  const { constructorItems } = useSelector(
    (store: RootState) => store.ConstructorItems
  );

  useEffect(() => {
    if (buns.length > 0) {
      dispatch(addBun(buns[0]));
    }
  }, [buns, dispatch]);
  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients buns={buns} mains={mains} sauces={sauces} />
            <BurgerConstructor constructorItems={constructorItems} />
          </div>
        </main>
      )}
    </>
  );
};
