interface IProps {
  msg?: string;
  key?: string;
}
const InputErrorMessage = ({ msg }: IProps) => {
  return msg ? (
    <span className="block pt-2 text-sm font-normal text-red-700">{msg}</span>
  ) : null;
};

export default InputErrorMessage;
