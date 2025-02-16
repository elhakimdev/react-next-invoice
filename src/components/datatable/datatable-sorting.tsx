import { SortDirection } from '@tanstack/react-table';

const DatatableSorting = ({
  direction,
}: {
  direction: false | SortDirection;
}) => {
  return (
    <div className="flex flex-col">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="4"
        stroke={direction === 'asc' ? 'currentColor' : 'gray'}
        className="size-[10px] transition-none ease-in-out duration-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="4"
        stroke={direction === 'desc' ? 'currentColor' : 'gray'}
        className="size-[10px] transition-none ease-in-out duration-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
  );
};

export default DatatableSorting;
