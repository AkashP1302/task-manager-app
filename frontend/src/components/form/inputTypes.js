import TextFieldComponent from "./fields/TextFieldComponent";
import SelectComponent from "./fields/SelectComponent";
import ImageUploadComponent from "./fields/ImageUploadComponent";
import DateInput from "./fields/DateInput";
import TextareaInput from "./fields/TextareaInput";

export const fieldComponents = {
  text: TextFieldComponent,
  select: SelectComponent,
  image: ImageUploadComponent,
  date: DateInput,
  textarea: TextareaInput,
};
