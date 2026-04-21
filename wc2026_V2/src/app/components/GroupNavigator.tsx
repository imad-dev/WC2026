import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface GroupNavigatorProps {
  activeGroup: string;
  onGroupChange: (group: string) => void;
}

export function GroupNavigator({ activeGroup, onGroupChange }: GroupNavigatorProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Matches');

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const filters = ['All Matches', 'Group Stage', 'Knockouts', 'Live Now'];

  const groupTeams: Record<string, string[]> = {
    F: ['🇵🇹', '🇲🇦', '🇭🇷', '🇧🇪', '🇨🇦', '🇯🇵'],
  };

  return (
    <aside
      className="w-[220px] border-r py-6"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
    >
      <div className="px-4 space-y-6">
        {/* Groups Section */}
        <div>
          <div
            className="text-xs uppercase tracking-wider mb-3 font-medium"
            style={{ color: 'var(--white-ghost)', letterSpacing: '0.08em' }}
          >
            Groups
          </div>
          <div className="space-y-1">
            {groups.map((group) => {
              const isExpanded = expandedGroup === group;
              const isActive = activeGroup === group;

              return (
                <div key={group}>
                  <button
                    onClick={() => {
                      setExpandedGroup(isExpanded ? null : group);
                      onGroupChange(group);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded transition-all duration-200 relative"
                    style={{
                      background: isActive ? 'var(--surface-3)' : 'transparent',
                      color: isActive ? 'var(--white-primary)' : 'var(--white-muted)',
                    }}
                  >
                    {isActive && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-0.5"
                        style={{ background: 'var(--green-live)' }}
                      />
                    )}
                    <span className="text-xs uppercase tracking-wide font-medium">GROUP {group}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--white-ghost)' }}
                    />
                  </button>

                  {isExpanded && groupTeams[group] && (
                    <div className="px-4 py-2 grid grid-cols-3 gap-2">
                      {groupTeams[group].map((flag, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-full flex items-center justify-center border"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <span className="text-lg">{flag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters Section */}
        <div>
          <div
            className="text-xs uppercase tracking-wider mb-3 font-medium"
            style={{ color: 'var(--white-ghost)', letterSpacing: '0.08em' }}
          >
            Filter By
          </div>
          <div className="space-y-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="w-full text-left px-3 py-2 rounded text-xs border transition-all duration-200"
                  style={{
                    background: isActive ? 'var(--green-live)' : 'transparent',
                    color: isActive ? 'var(--void)' : 'var(--white-muted)',
                    borderColor: isActive ? 'var(--green-live)' : 'var(--border)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
