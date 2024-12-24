import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findIngredient } from '../../services/slice';
import { RootState } from 'src/services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ingredient, isLoading } = useSelector(
    (store: RootState) => store.BurgerIngredients
  );
  const ingredientData = ingredient;
  useEffect(() => {
    dispatch(findIngredient(id));
  }, [dispatch, isLoading]);
  if (isLoading) {
    return <Preloader />;
  }
  if (!ingredientData) {
    return <Preloader />;
  }
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
