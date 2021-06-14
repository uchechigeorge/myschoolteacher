export interface IListDetailsOptions{
  title: string,
  id?: any,
  subtitle?: string,
  button?: boolean,
  icon?: string,
  iconSrc?: string,
  hasHeader?: boolean,
  toggle?: boolean,
  header?: string,
  showSecondaryIcon?: boolean,
  secondaryIcon?: string,
  handler?: () => void,
}

export interface ICardDetail {
  showImage?: boolean,
  altImage?: 'text' | 'icon',
  imageText?: string,
  imageSrc?: string,
  details?: { [key: string]: string },
  cardData?: any,
  btnClick?: () => void,
}

export const isDefaultImage = (imgSrc: string) => {
  return imgSrc.indexOf("files/dp/dp.png") != -1;
}

export interface IFilterCard {
  filterTitle?: string,
  filterData?: ICardDetail[],
}


export interface IEditInput{
  id?: any,
  model: any,
  value?: string,
  type?: 'text' | 'email' | 'number' | 'password' | 'date' | 'select',
  inputmode?: string,
  directives?: IInputDirectives,
  icon?: string,
  label?: string,
  noEdit?: boolean,
  suffix?: string,
  hasHeader?: boolean,
  headerTitle?: string,
  isValid?: boolean,
  canUpdate?: boolean,
  secondaryIcon?: string,
  secondaryText?: string,
  showSecondaryBtn?: boolean,
  valiators?: IValidatorTypes[],
  selectOptions?: ISelectOptions[] | ISelectMultipleOptions[],
  selectMultiple?: boolean,
  multipleSelectOptions?: boolean,
  updateInput?: () => Promise<boolean | void>,
  // updateValue?: () => Promise<boolean | void>,
  inputChange?: (e?: { event: any, model: any }) => void,
  inputBlur?: (e?: any) => void,
  secondaryBtnCLick?: (e) => void,
}

export interface ISelectOptions{
  text?: string,
  value?: string,
}

export interface ISelectMultipleOptions{
  label?: string,
  options?: ISelectOptions[],
}

export type IValidatorTypes = 'email' | 'required' | 'maxLength' | 'negative' | 'isNan' | 'currency' | 'none';
export type IInputDirectives = 'currency';
