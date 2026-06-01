# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj files first (better caching)
COPY ["DoctorAppointmentSystem.Api/DoctorAppointmentSystem.Api.csproj", "DoctorAppointmentSystem.Api/"]
COPY ["DoctorAppointmentSystem.Application/DoctorAppointmentSystem.Application.csproj", "DoctorAppointmentSystem.Application/"]
COPY ["DoctorAppointmentSystem.Domain/DoctorAppointmentSystem.Domain.csproj", "DoctorAppointmentSystem.Domain/"]
COPY ["DoctorAppointmentSystem.Infrastructure/DoctorAppointmentSystem.Infrastructure.csproj", "DoctorAppointmentSystem.Infrastructure/"]

RUN dotnet restore "DoctorAppointmentSystem.Api/DoctorAppointmentSystem.Api.csproj"

# Copy everything else
COPY . .

WORKDIR "/src/DoctorAppointmentSystem.Api"
RUN dotnet publish "DoctorAppointmentSystem.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "DoctorAppointmentSystem.Api.dll"]