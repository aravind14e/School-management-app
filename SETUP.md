# Setup Guide

Follow these steps to set up and run the School Management System.

## Prerequisites

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **MySQL Server** - Download from [mysql.com](https://dev.mysql.com/downloads/mysql/)
3. **Git** - Download from [git-scm.com](https://git-scm.com/)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd school-management-system

# Install dependencies
npm install
```

## Step 2: Database Setup

1. **Start MySQL Server**
   - On Windows: Start MySQL service
   - On macOS: `brew services start mysql`
   - On Linux: `sudo systemctl start mysql`

2. **Create Environment File**
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=school_management
   
   # Next.js Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Initialize Database**
   ```bash
   npm run init-db
   ```

## Step 3: Run the Application

```bash
# Start the development server
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Application

1. **Add a School**
   - Go to the home page (`/`)
   - Fill out the form with school details
   - Upload an image
   - Submit the form

2. **View Schools**
   - Navigate to `/showSchools`
   - View the schools in the responsive grid

## Troubleshooting

### Database Connection Issues
- Ensure MySQL server is running
- Check your database credentials in `.env.local`
- Verify the database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Issues
- If port 3000 is in use, Next.js will automatically use the next available port
- Check the terminal output for the correct URL

### Image Upload Issues
- Ensure the `public/schoolImages` directory exists
- Check file permissions on the upload directory

### Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Production Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```env
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=your-production-db-name
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
```

## Database Schema

The application creates the following table structure:

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact VARCHAR(15) NOT NULL,
  image TEXT,
  email_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `GET /api/schools` - Fetch all schools
- `POST /api/schools` - Add a new school

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure database connection is working
4. Check file permissions for image uploads
