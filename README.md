 # School Directory Management System

A comprehensive school directory system built with Next.js 14, React Hook Form, TailwindCSS, and SQLite.

## Features

- **Add School Form**: Responsive form with validation for adding new schools
- **School Directory**: Display schools in cities view, grid, and list layouts
- **Search & Filter**: Search schools by name, city, or address
- **City-based Navigation**: Browse schools by city with beautiful city cards
- **School Details**: Comprehensive school information pages
- **Image Upload**: Automatic image upload and storage
- **Database Integration**: SQLite database for easy deployment
- **Form Validation**: Client-side and server-side validation
- **Responsive Design**: Mobile-first design with TailwindCSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS
- **Forms**: React Hook Form
- **Database**: SQLite with better-sqlite3
- **File Upload**: Built-in Next.js file handling
- **Validation**: React Hook Form validation + server-side validation

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**
   Create a `.env.local` file in the root directory if needed:
   ```env
   # Next.js Configuration (Optional)
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application automatically creates the `schools` table with the following structure:

```sql
CREATE TABLE schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact TEXT NOT NULL,
  image TEXT,
  email_id TEXT NOT NULL,
  board_affiliation TEXT,
  academic_programs TEXT,
  facilities TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
├── app/
│   ├── api/schools/
│   │   ├── route.ts          # API routes for schools
│   │   └── [id]/route.ts     # Individual school API
│   ├── schools/
│   │   └── [id]/page.tsx     # School details page
│   ├── showSchools/
│   │   └── page.tsx          # Schools directory page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Add school form
├── lib/
│   ├── db-sqlite.ts          # SQLite database connection
│   └── db.js                 # MySQL database connection (backup)
├── public/
│   ├── schoolImages/         # Uploaded school images
│   └── cityImages/           # City background images
├── scripts/
│   ├── init-db.js            # Database initialization
│   └── migrate-db.js         # Database migration
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## API Endpoints

### GET /api/schools
Fetches all schools from the database.

**Response:**
```json
[
  {
    "id": 1,
    "name": "School Name",
    "address": "School Address",
    "city": "City",
    "state": "State",
    "contact": "1234567890",
    "image": "/schoolImages/school_1234567890.jpg",
    "email_id": "school@example.com",
    "board_affiliation": "CBSE",
    "academic_programs": "Science, Commerce, Arts",
    "facilities": "Library, Lab, Sports",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/schools/[id]
Fetches a specific school by ID.

### POST /api/schools
Adds a new school to the database.

**Request:** FormData with the following fields:
- `name` (required): School name
- `address` (required): School address
- `city` (required): City
- `state` (required): State
- `contact` (required): Contact number
- `email_id` (required): Valid email address
- `image` (required): Image file
- `board_affiliation` (optional): Educational board
- `academic_programs` (optional): Academic programs offered
- `facilities` (optional): School facilities

**Response:**
```json
{
  "message": "School added successfully",
  "id": 1
}
```

## Form Validation

### Client-side Validation (React Hook Form)
- All fields are required
- Email must be in valid format
- Contact number must be exactly 10 digits
- Image file is required

### Server-side Validation
- Additional validation for all fields
- File type validation
- Database constraint validation

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```env
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
```

## Features in Detail

### Add School Form (`/`)
- Responsive design that works on desktop and mobile
- Real-time form validation
- File upload with preview
- Success/error feedback
- Form reset functionality
- Additional fields for board affiliation, academic programs, and facilities

### School Directory (`/showSchools`)
- **Cities View**: Browse schools organized by city with beautiful city cards
- **Grid View**: Responsive grid layout with school cards
- **List View**: Detailed list view with sorting options
- **Search & Filter**: Search by school name, city, or address
- **Pagination**: Navigate through large datasets
- **Loading states and error handling**

### School Details (`/schools/[id]`)
- Comprehensive school information display
- Academic programs section with beautiful cards
- School facilities section with icons
- Contact information and location details
- Responsive design for all devices

### Image Upload
- Automatic directory creation
- Unique filename generation
- File type validation
- Optimized image storage in `/public/schoolImages/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
