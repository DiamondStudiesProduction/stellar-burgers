import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  deleteAll,
  orderBurgerApiThunk,
  orderModalDataIsNull
} from '../../services/slice';
import { AppDispatch, RootState } from '../../services/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC<any> = ({ constructorItems }) => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch: AppDispatch = useDispatch();
  const { orderModalData, orderRequest } = useSelector(
    (store: RootState) => store.orderBurger
  );
  const navigate = useNavigate();
  const { user } = useSelector((store: RootState) => store.user);
  const onOrderClick = () => {
    if (user) {
      if (!constructorItems.bun || constructorItems.orderRequest) {
        return;
      } else {
        const ingredientsId = constructorItems.ingredients.map(
          (item: TIngredient) => item._id
        );
        ingredientsId.unshift(constructorItems.bun._id);
        ingredientsId.push(constructorItems.bun._id);
        dispatch(orderBurgerApiThunk(ingredientsId)).then(
          (res: any) => res.payload.success && dispatch(deleteAll())
        );
      }
    } else if (!user) {
      navigate('/login', { replace: true });
    }
  };
  const closeOrderModal = () => {
    dispatch(orderModalDataIsNull());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
