import { IFilterData } from '@interfaces/filter-data';
import { Button, Filter, PopupMenu } from '@sk-web-gui/react';
import { ChevronDown } from 'lucide-react';

interface ColumnFilterProps {
  label: string;
  filterData: IFilterData[];
  onFilterChange: (filterData: IFilterData[]) => void;
}

export const ColumnFilter = ({ label, filterData, onFilterChange }: ColumnFilterProps) => {
  const setAll = (value: boolean) => {
    onFilterChange(filterData.map((item) => (item.disabled ? item : { ...item, value })));
  };

  const toggle = (toggled: IFilterData) => {
    onFilterChange(filterData.map((item) => (item.id === toggled.id ? { ...item, value: !item.value } : item)));
  };

  return (
    <div className="relative" data-cy="column-filter">
      <PopupMenu type="dialog">
        <PopupMenu.Button variant="ghost" size="sm" rightIcon={<ChevronDown />}>
          {label}
        </PopupMenu.Button>
        <PopupMenu.Panel>
          <div className="flex gap-8">
            <Button variant="tertiary" size="sm" onClick={() => setAll(true)}>
              Visa alla
            </Button>
            <Button variant="tertiary" size="sm" onClick={() => setAll(false)}>
              Dölj alla
            </Button>
          </div>
          <Filter>
            <Filter.Label className="sr-only">{label}</Filter.Label>
            {filterData
              .filter((item) => item.isShown === undefined || item.isShown)
              .map((item) => (
                <Filter.Item key={item.id} checked={item.value} disabled={item.disabled} onChange={() => toggle(item)}>
                  {item.name}
                </Filter.Item>
              ))}
          </Filter>
        </PopupMenu.Panel>
      </PopupMenu>
    </div>
  );
};

export default ColumnFilter;
