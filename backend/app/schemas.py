from decimal import Decimal
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class LoginIn(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    full_name: str
    username: str = Field(pattern=r"^[a-z0-9._-]{3,80}$")
    password: str = Field(min_length=8)
    role: str

class StatusIn(BaseModel):
    is_active: bool

class CategoryIn(BaseModel):
    code: str = Field(pattern=r"^[A-Za-z0-9_-]{1,30}$")
    name: str
    is_active: bool = True

class ProductIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(pattern=r"^[A-Za-z0-9_-]{1,30}$")
    name: str
    category_id: int
    selling_price: Decimal = Field(ge=0)
    purchase_price: Decimal = Field(ge=0)
    description: str | None = None
    is_active: bool = True

class ProductUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    category_id: int
    selling_price: Decimal = Field(ge=0)
    purchase_price: Decimal = Field(ge=0)
    description: str | None = None
    is_active: bool = True

class CustomerIn(BaseModel):
    full_name: str
    phone: str | None = None
    email: EmailStr | None = None
    customer_group: str | None = None

class InvoiceLineIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)

class InvoiceIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    customer_id: int | None = None
    discount_amount: Decimal = Field(default=Decimal("0"), ge=0)
    payment_method: str | None = None
    items: list[InvoiceLineIn]

class CancelIn(BaseModel):
    reason: str = Field(min_length=3)

class PurchaseLineIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    unit_cost: Decimal = Field(ge=0)

class PurchaseIn(BaseModel):
    items: list[PurchaseLineIn]

class ProductAdviceIn(BaseModel):
    need: str = Field(min_length=1, max_length=1000)

class DateRangeIn(BaseModel):
    start_date: str
    end_date: str

class SalesQaIn(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    start_date: str | None = None
    end_date: str | None = None
