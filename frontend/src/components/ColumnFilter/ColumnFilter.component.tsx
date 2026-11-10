import { IFilterData } from '@interfaces/filter-data';
import { Button, Checkbox, PopupMenu } from '@sk-web-gui/react';
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
      <PopupMenu type="dialog" align="start">
        <PopupMenu.Button variant="tertiary" size="sm" rightIcon={<ChevronDown />}>
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
          <PopupMenu.Items autoFocus={false} aria-label={label}>
            {filterData
              .filter((item) => item.isShown === undefined || item.isShown)
              .map((item) => (
                <PopupMenu.Item key={item.id}>
                  <Checkbox checked={item.value} disabled={item.disabled} onChange={() => toggle(item)}>
                    {item.name}
                  </Checkbox>
                </PopupMenu.Item>
              ))}
          </PopupMenu.Items>
        </PopupMenu.Panel>
      </PopupMenu>
    </div>
  );
};

export default ColumnFilter;
