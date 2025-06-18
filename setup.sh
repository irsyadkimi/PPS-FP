#!/bin/bash

# Diet App Setup Script
# Author: Assistant
# Description: Automated setup for diet-app project

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root"
        exit 1
    fi
}

# Install Docker and Docker Compose
install_docker() {
    print_header "Installing Docker and Docker Compose"
    
    # Check if docker is already installed
    if command -v docker &> /dev/null; then
        print_status "Docker is already installed"
    else
        print_status "Installing Docker..."
        sudo apt update
        sudo apt install -y docker.io
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
        print_status "Docker installed successfully"
    fi
    
    # Check if docker-compose is already installed
    if command -v docker-compose &> /dev/null; then
        print_status "Docker Compose is already installed"
    else
        print_status "Installing Docker Compose..."
        sudo apt install -y docker-compose
        print_status "Docker Compose installed successfully"
    fi
}

# Install Node.js and npm
install_nodejs() {
    print_header "Installing Node.js and npm"
    
    if command -v node &> /dev/null; then
        print_status "Node.js is already installed ($(node --version))"
    else
        print_status "Installing Node.js from NodeSource..."
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
        print_status "Node.js installed successfully ($(node --version))"
    fi
    
    if command -v npm &> /dev/null; then
        print_status "npm is already installed ($(npm --version))"
    else
        print_error "npm not found after Node.js installation"
        exit 1
    fi
}

# Setup project dependencies
setup_project() {
    print_header "Setting up Project Dependencies"
    
    # Navigate to project directory
    cd ~/pps/diet-app
    
    # Setup backend
    if [ -d "backend" ]; then
        print_status "Setting up backend dependencies..."
        cd backend
        npm install
        cd ..
        print_status "Backend dependencies installed"
    else
        print_warning "Backend directory not found"
    fi
    
    # Setup frontend
    if [ -d "frontend" ]; then
        print_status "Setting up frontend dependencies..."
        cd frontend
        npm install
        cd ..
        print_status "Frontend dependencies installed"
    else
        print_warning "Frontend directory not found"
    fi
}

# Create helper scripts
create_helper_scripts() {
    print_header "Creating Helper Scripts"
    
    cd ~/pps/diet-app
    
    # Create start script
    cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting Diet App with Docker Compose..."
docker-compose up --build
EOF
    
    # Create start backend only script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting Backend only..."
cd backend
npm start
EOF
    
    # Create start frontend only script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting Frontend only..."
cd frontend
npm start
EOF
    
    # Create stop script
    cat > stop.sh << 'EOF'
#!/bin/bash
echo "Stopping Diet App..."
docker-compose down
EOF
    
    # Create development script
    cat > dev.sh << 'EOF'
#!/bin/bash
echo "Starting Diet App in development mode..."
docker-compose -f docker-compose.yml up --build
EOF
    
    # Create logs script
    cat > logs.sh << 'EOF'
#!/bin/bash
echo "Showing Diet App logs..."
docker-compose logs -f
EOF
    
    # Make scripts executable
    chmod +x *.sh
    
    print_status "Helper scripts created successfully"
}

# Display usage information
show_usage() {
    print_header "Diet App Setup Complete!"
    echo ""
    echo "Available commands:"
    echo "  ./start.sh          - Start full application with Docker"
    echo "  ./start-backend.sh  - Start backend only"
    echo "  ./start-frontend.sh - Start frontend only"
    echo "  ./stop.sh           - Stop Docker containers"
    echo "  ./dev.sh            - Start in development mode"
    echo "  ./logs.sh           - View application logs"
    echo ""
    echo "Manual Docker commands:"
    echo "  docker-compose up --build                    - Start all services"
    echo "  docker-compose up --build backend mongo      - Start specific services"
    echo "  docker-compose down                          - Stop all services"
    echo "  docker-compose logs -f                       - View logs"
    echo ""
    print_warning "Note: If you added user to docker group, you may need to logout and login again"
}

# Main execution
main() {
    print_header "Diet App Automated Setup"
    
    check_root
    install_docker
    install_nodejs
    setup_project
    create_helper_scripts
    show_usage
    
    print_status "Setup completed successfully!"
}

# Handle script arguments
case "${1:-}" in
    --docker-only)
        install_docker
        ;;
    --node-only)
        install_nodejs
        ;;
    --project-only)
        setup_project
        ;;
    --scripts-only)
        create_helper_scripts
        ;;
    --help|-h)
        echo "Usage: $0 [option]"
        echo "Options:"
        echo "  --docker-only    Install Docker and Docker Compose only"
        echo "  --node-only      Install Node.js and npm only"
        echo "  --project-only   Setup project dependencies only"
        echo "  --scripts-only   Create helper scripts only"
        echo "  --help, -h       Show this help message"
        echo ""
        echo "Run without arguments to perform full setup"
        ;;
    *)
        main
        ;;
esac
