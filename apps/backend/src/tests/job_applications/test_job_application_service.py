import pytest
import uuid
from src.job_applications.services import job_application_service
from src.user.model import User
from src.configs.database_config import get_session_context
from src.core.service_registry import ServiceRegistry
from src.job_applications.model import JobApplication
from src.job_applications.types import (
    ResearchPlan,
    ResearchCategory,
    DiscoveredCompanyProfile,
)


@pytest.fixture
def test_discovered_company_profile():
    """Fixture to create a test DiscoveredCompanyProfile"""
    return DiscoveredCompanyProfile(
        company_name="TechCorp Solutions Inc.",
        official_website="https://techcorp-solutions.com",
        discovery_confidence="high",
        key_properties={
            "careers_page": "https://techcorp-solutions.com/careers",
            "engineering_blog": "https://techcorp-solutions.com/blog/engineering",
            "about_page": "https://techcorp-solutions.com/about",
            "contact_page": "https://techcorp-solutions.com/contact",
        },
        company_characteristics={
            "company_size_estimate": "medium",
            "company_type": "private",
        },
        research_context={
            "information_availability": "high",
            "web_presence_quality": "professional",
            "research_difficulty": "easy",
        },
        linkedin_company_page="https://linkedin.com/company/techcorp-solutions",
        additional_verified_urls=[
            "https://techcorp-solutions.com/products",
            "https://techcorp-solutions.com/team",
            "https://techcorp-solutions.com/news",
        ],
        discovery_notes="Company has a strong online presence with comprehensive website, active LinkedIn page, and detailed company information readily available. Engineering blog shows technical expertise and company culture.",
        sources_consulted=[
            "Company website: techcorp-solutions.com",
            "LinkedIn company page",
            "Google search results",
            "Company careers page",
        ],
    )


@pytest.fixture
def test_research_plan():
    return ResearchPlan(
        target_role="role",
        research_categories=[
            ResearchCategory(
                category_name="test_category",
                description="description",
                priority=1,
                data_points=["test_data_point"],
            )
        ],
        rationale="rationale",
    )


@pytest.fixture
def test_user():
    """Fixture to create a test user"""
    with get_session_context() as session:
        test_user = User(
            id=str(uuid.uuid4()), email="test@example.com", name="Test User"
        )
        session.add(test_user)
        session.commit()
        yield test_user
        # Cleanup after test
        session.delete(test_user)
        session.commit()


@pytest.fixture
def test_job_application(test_user):
    """Fixture to create a test job_application"""
    with get_session_context() as session:
        test_job_application = JobApplication(
            job_description="description",
            job_title="title",
            company_name="company",
            user_id=test_user.id,
        )
        session.add(test_job_application)
        session.commit()
        yield test_job_application
        # Cleanup after test
        session.delete(test_job_application)
        session.commit()


def test_update_company_profile_research_plan(
    test_job_application, test_discovered_company_profile
):
    with get_session_context() as session:
        ###Arrange
        job_application_service = ServiceRegistry.get_job_application_service(session)
        test_research_plan = ResearchPlan(
            target_role=test_job_application.job_title,
            research_categories=[
                ResearchCategory(
                    category_name="test_category",
                    description="description",
                    priority=1,
                    data_points=["test_data_point"],
                )
            ],
            rationale="rationale",
        )
        updated_job_application = (
            job_application_service.update_company_profile_discovery_results(
                test_job_application.id, test_discovered_company_profile
            )
        )

        ###ACT
        updated_job_application = (
            job_application_service.update_company_profile_research_plan(
                test_job_application.id, test_research_plan
            )
        )

        ###ASSERT
        assert updated_job_application.company_profile["research_plan"]


def test_update_company_profile_research_results(
    test_job_application, test_research_plan
):
    with get_session_context() as session:
        ###Arrange
        job_application_service = ServiceRegistry.get_job_application_service(session)
        test_results = {"tech_stack": "Go, Python, React"}
        updated_application = (
            job_application_service.update_company_profile_research_plan(
                test_job_application.id, test_research_plan
            )
        )

        ###ACT
        updated_application = (
            job_application_service.update_company_profile_research_results(
                test_job_application.id, test_results
            )
        )

        ###ASSERT
        assert updated_application.company_profile["research_results"]


def test_list_paginated_job_applications():
    with get_session_context() as session:
        job_application_service = ServiceRegistry.get_job_application_service(session)
        paginated_results = job_application_service.list_paginated(
            "55006113-e437-4b22-9637-2b99a3885da0"
        )
        assert len(paginated_results) > 0
