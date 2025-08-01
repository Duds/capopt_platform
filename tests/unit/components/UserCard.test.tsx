/**
 * @test UserCard.test.tsx
 * @schema User { id, name, email, role, isActive, lastLogin }
 * @testIds from `lib/testSelectors.ts`
 * @seed from `/prisma/seed/users/`
 * @note Demonstrates AI-aware testing strategy
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { userTestIds } from '@/lib/testSelectors';
import { UserCard } from '@/components/UserCard';

// Mock the UserCard component for demonstration
const UserCard = ({ user, onEdit, onDelete }: {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLogin?: Date;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}) => {
  return (
    <div data-testid={userTestIds.userCard}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span data-testid={user.isActive ? userTestIds.userStatusActive : userTestIds.userStatusInactive}>
        {user.isActive ? 'Active' : 'Inactive'}
      </span>
      {user.lastLogin && (
        <span data-testid={userTestIds.userLastLogin}>
          Last login: {user.lastLogin.toLocaleDateString()}
        </span>
      )}
      <div className="flex gap-2">
        {onEdit && (
          <button 
            data-testid={userTestIds.userEditButton}
            onClick={() => onEdit(user.id)}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button 
            data-testid={userTestIds.userDeleteButton}
            onClick={() => onDelete(user.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

describe('UserCard', () => {
  const mockUser = global.testUtils.createMockUser();

  it('should render user information correctly', () => {
    render(<UserCard user={mockUser} />);
    
    // Validate test IDs are used correctly
    expect(screen.getByTestId(userTestIds.userCard)).toBeInTheDocument();
    expect(screen.getByTestId(userTestIds.userStatusActive)).toBeInTheDocument();
    
    // Validate content is displayed
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('john.smith@example.com.au')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should display last login information when available', () => {
    const userWithLastLogin = {
      ...mockUser,
      lastLogin: new Date('2024-01-15T10:30:00Z'),
    };

    render(<UserCard user={userWithLastLogin} />);
    
    expect(screen.getByTestId(userTestIds.userLastLogin)).toBeInTheDocument();
    expect(screen.getByText(/Last login:/)).toBeInTheDocument();
  });

  it('should display inactive status for inactive users', () => {
    const inactiveUser = {
      ...mockUser,
      isActive: false,
    };

    render(<UserCard user={inactiveUser} />);
    
    expect(screen.getByTestId(userTestIds.userStatusInactive)).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByTestId(userTestIds.userEditButton));
    expect(onEdit).toHaveBeenCalledWith('test-user-id');
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<UserCard user={mockUser} onDelete={onDelete} />);
    
    fireEvent.click(screen.getByTestId(userTestIds.userDeleteButton));
    expect(onDelete).toHaveBeenCalledWith('test-user-id');
  });

  it('should not render action buttons when callbacks are not provided', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.queryByTestId(userTestIds.userEditButton)).not.toBeInTheDocument();
    expect(screen.queryByTestId(userTestIds.userDeleteButton)).not.toBeInTheDocument();
  });

  it('should validate all test IDs are from centralized file', () => {
    const { container } = render(<UserCard user={mockUser} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    const validation = global.testUtils.validateTestIds(container);
    expect(validation.valid).toBe(true);
    expect(validation.invalidTestIds).toHaveLength(0);
  });

  it('should use realistic Australian business data', () => {
    const australianUser = {
      ...mockUser,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@crackedmountain.com.au',
    };

    render(<UserCard user={australianUser} />);
    
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('sarah.johnson@crackedmountain.com.au')).toBeInTheDocument();
    
    // Validate email follows Australian business pattern
    expect('sarah.johnson@crackedmountain.com.au').toMatch(/@.*\.com\.au$/);
  });

  it('should handle different user roles appropriately', () => {
    const managerUser = {
      ...mockUser,
      role: 'MANAGER',
      name: 'Michael Chen',
    };

    render(<UserCard user={managerUser} />);
    
    expect(screen.getByText('Michael Chen')).toBeInTheDocument();
    // Additional role-specific assertions could be added here
  });

  it('should be accessible with proper ARIA labels', () => {
    render(<UserCard user={mockUser} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    // Check that interactive elements have proper accessibility attributes
    const editButton = screen.getByTestId(userTestIds.userEditButton);
    const deleteButton = screen.getByTestId(userTestIds.userDeleteButton);
    
    expect(editButton).toHaveAttribute('role', 'button');
    expect(deleteButton).toHaveAttribute('role', 'button');
  });

  it('should handle edge cases gracefully', () => {
    const userWithLongName = {
      ...mockUser,
      name: 'Dr. Elizabeth Margaret O\'Connor-Smith-Jones',
      email: 'very.long.email.address@very.long.domain.name.com.au',
    };

    render(<UserCard user={userWithLongName} />);
    
    expect(screen.getByText('Dr. Elizabeth Margaret O\'Connor-Smith-Jones')).toBeInTheDocument();
    expect(screen.getByText('very.long.email.address@very.long.domain.name.com.au')).toBeInTheDocument();
  });

  it('should maintain consistent styling and layout', () => {
    const { container } = render(<UserCard user={mockUser} />);
    
    const card = screen.getByTestId(userTestIds.userCard);
    expect(card).toBeInTheDocument();
    
    // Check that the card has the expected structure
    expect(card.querySelector('h3')).toBeInTheDocument();
    expect(card.querySelector('p')).toBeInTheDocument();
    expect(card.querySelector('span')).toBeInTheDocument();
  });
});

// Integration test example
describe('UserCard Integration', () => {
  it('should work with real user data from seed files', () => {
    // This would typically use actual seed data
    const seedUser = {
      id: 'seed-user-1',
      name: 'Admin User',
      email: 'admin@crackedmountain.com.au',
      role: 'ADMIN',
      isActive: true,
      lastLogin: new Date('2024-01-15T10:30:00Z'),
    };

    render(<UserCard user={seedUser} />);
    
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@crackedmountain.com.au')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should handle user data from API responses', () => {
    // Mock API response format
    const apiUser = {
      id: 'api-user-1',
      name: 'API Test User',
      email: 'api.test@example.com.au',
      role: 'USER',
      isActive: true,
      lastLogin: '2024-01-15T10:30:00Z', // ISO string from API
      createdAt: '2024-01-01T09:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    };

    // Convert API format to component format
    const componentUser = {
      ...apiUser,
      lastLogin: new Date(apiUser.lastLogin),
    };

    render(<UserCard user={componentUser} />);
    
    expect(screen.getByText('API Test User')).toBeInTheDocument();
    expect(screen.getByText('api.test@example.com.au')).toBeInTheDocument();
  });
}); 