FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["DoctorAppointmentSystem.Api/DoctorAppointmentSystem.Api.csproj", "DoctorAppointmentSystem.Api/"]
COPY ["DoctorAppointmentSystem.Application/DoctorAppointmentSystem.Application.csproj", "DoctorAppointmentSystem.Application/"]
COPY ["DoctorAppointmentSystem.Domain/DoctorAppointmentSystem.Domain.csproj", "DoctorAppointmentSystem.Domain/"]
COPY ["DoctorAppointmentSystem.Infrastructure/DoctorAppointmentSystem.Infrastructure.csproj", "DoctorAppointmentSystem.Infrastructure/"]
RUN dotnet restore "DoctorAppointmentSystem.Api/DoctorAppointmentSystem.Api.csproj"
COPY . .
WORKDIR "/src/DoctorAppointmentSystem.Api"
RUN dotnet build "./DoctorAppointmentSystem.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./DoctorAppointmentSystem.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DoctorAppointmentSystem.Api.dll"]
