import { Spinner } from '@sk-web-gui/react';

const spinnerSizes = { sm: 1, md: 1.5, lg: 2, xl: 3 };

export default function Loader(props) {
  const { size = 'md', ...rest } = props;
  return (
    <span className="inline-flex">
      <Spinner size={spinnerSizes[size] ?? size} {...rest} />
    </span>
  );
}
