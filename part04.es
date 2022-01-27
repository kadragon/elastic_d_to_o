
// 4-1 쿼리 컨테스트 실행
GET kibana_sample_data_ecommerce/_search
{
    "query": {
        "match": {
            "category": "clothing"
        }
    }
}
/**
    match: 전문 검색을 위한 쿼리 / 역인텍싱된 용어를 검색할 때 사용
    kibana_sample_data_ecommerce 인덱스에 있는
    catagory 필드의 역인덱스 테이블에 'clothing' 용어가 있는
    도큐먼트를 찾아달라는 요청
*/

// 4-2 필터 컨텍스트 실행
GET kibana_sample_data_ecommerce/_search
{
    "query": {
        "bool": {
            "filter": {
                "term": {
                    "day_of_week": "Friday"
                }
            }
        }
    }
}
/**
    필터 컨텍스트와 쿼리 컨텍스를 구분하는 특별한 API가 있는 것은 아님.

    필터 컨텍스트는 논리(bool) 쿼리 내부의 filter 타임에 적용
    kibana_sample_data_ecommerce 인텍스의 day_of_week 필드가
    'Friday'인 도큐먼트를 찾아달라는 요청
 */

// 4-3 쿼리 스트링 예시
GET kibana_sample_data_ecommerce/_search/q=customer_full_name:Mary

// 4-4 쿼리 DSL 예시
GET kibana_sample_data_ecommerce/_search
{
    "query": {
        "match": {
            "customer_full_name": "Mary"
        }
    }
}

// 4-5 설명이 포함된 쿼리 컨텍스트 실행
GET kibana_sample_data_ecommerce/_search
{
    "query": {
        "match": {
            "products.product_name": "Pants"
        }
    },
    "explain": true
}
/**
    검색 시 explain: true를 추가하면 쿼리 내부적인 최적화 방법과 어떤 경로를 통해 검색되었으며 어떤 기준으로 스코어가 계산되어있는지 알 수 있음.
 */

// 4-11 하나의 용어를 검색하는 매치 쿼리
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name"
    ],
    "query": {
        "match": {
            "customer_full_name": "Mary"
        }
    }
}
/**
    필드명을 모를 경우 _mapping 으로 인덱스에 포함된 필드를 확인

    _source 파라미터는 보여주는 필드 목록을 지정할 수 있음.
 */

// 4-12 복수 개의 용어를 검색하는 매치 쿼리
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name"
    ],
    "query": {
        "match": {
            "customer_full_name": "mary bailey"
        }
    }
}
/** 
    검색어인 mary bailey는 분석기에 의해 [mary, bailey]로 토큰화
    매치 쿼리에서 용어들 간의 공백은 OR로 인식.
 */

// 4-14 operator를 and로 설정한 매치 검색
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name"
    ],
    "query": {
        "match": {
            "customer_full_name": {
                "query": "mary bailey",
                "operator": "and"
            }
        }
    }
}
/**
    매치 쿼리에서 용어들 간의 공백은 OR로 인식하는 것을 AND로 변경.
 */

// 4-16 match phrase query
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name"
    ],
    "query": {
        "match_phrase": {
            "customer_full_name": "mary bailey"
        }
    }
}
/**
    검색어인 'mary bailey'가 [mary, bailey]로 토큰화되지만,
    매치 프레이즈 쿼리는 검색어에 사용된 용오들이 모두 포함되면서
    용어의 순서까지 맞아야 함.

    프레이즈 쿼리는 검색 시 많은 리소스를 요구하기 때문에 자주 사용하지 X
 */

// 4-18 텍스트 타입 필드에 대한 용어 쿼리
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name"
    ],
    "query": {
        "term": {
            "customer_full_name": "Mary Bailey"
        }
    }
}
/**
    'customer_full_name' 필드는 텍스트로 매핑되어 있어, 
    Mary Bailey가 [mary, bailey]라는 2개의 토큰화되어 있음.

    그래서 매칭되지 않음.
 */

// 4-20 키워드 타입 필드에 대한 용어 쿼리
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name"
    ],
    "query": {
        "term": {
            "customer_full_name.keyword": "Mary Bailey"
        }
    }
}
/**
    _mapping 으로 확인하여 멀티 필드로 지정되어 있기 때문에, 
    keyword 필드에 용어 쿼리를 요청.

    용어 수준 쿼리는 키워드 타입으로 매핑된 필드를 대상으로 주로 키워드 검색이나 범주형 데이터를 검색하는 용도로 사용
    매치 쿼리를 포함한 전문 쿼리는 텍스트 타입으로 매핑된 필드를 대상으로 전문 검색에 사용해야 한다.
 */

// 4-22 용어들 쿼리
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "day_of_week"
    ],
    "query": {
        "terms": {
            "day_of_week": [
                "Monday",
                "Sunday"
            ]
        }
    }
}

// 4-23 여러 필드에 쿼리 요청하기
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_first_name",
        "customer_last_name",
        "customer_full_name"
    ],
    "query": {
        "multi_match": {
            "query": "mary",
            "fields": [
                "customer_*_name"
            ]
        }
    }
}
// 4-25 가중치를 이용한 검색
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_first_name",
        "customer_last_name",
        "customer_full_name"
    ],
    "query": {
        "multi_match": {
            "query": "mary",
            "fields": [
                "customer_first_name",
                "customer_last_name",
                "customer_full_name^2"
            ]
        }
    }
}

// 4-26 날짜/.시간 범위 쿼리
GET kibana_sample_data_flights/_search
{
    "query": {
        "range": {
            "timestamp": {
                "gte": "2022-01-27",
                "lt": "2022-01-28"
            }
        }
    }
}

/**
    gte: 10 | >= 10
    gt:  10 | >  10
    lte: 10 | <= 10
    lt:  10 | <  10
 */

// 4-27 날짜/시간 범위 쿼리
GET kibana_sample_data_flights/_search
{
    "query": {
        "range": {
            "timestamp": {
                "gte": "now-1M"
            }
        }
    }
}
/**
    y, M, w, d, H or h, m, s
 */

// 4-33 하나의 쿼리를 사용하는 must 타입
GET kibana_sample_data_ecommerce/_search
{
    "query": {
        "bool": {
            "must": {
                "match": {
                    "customer_first_name": "mary"
                }
            }
        }
    }
}
/**
 must: 쿼리를 실행하여 참인 도큐먼트를 찾음.
 must_not: 쿼리를 실행하여 거짓인 도큐먼트를 찾음.
 should: 단독으로 사용 시 쿼리르 실행하여 참인 도큐, 복수시 OR
 filter: 쿼리를 실행하여 '예/아니오' 형식의 필터 컨텍스트 수행
 */

// 4-34 복수 개의 쿼리를 사용하는 must 타입 
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name"
    ],
    "query": {
        "bool": {
            "must": [
                {
                    "term": {
                        "day_of_week": "Sunday"
                    }
                },
                {
                    "match": {
                        "customer_full_name": "mary"
                    }
                }
            ]
        }
    }
}

// 4-36 다른 타입과 must_not 타입을 함께 사용하는 경우
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name",
    ],
    "query": {
        "bool": {
            "must": {
                "match": {
                    "customer_first_name": "mary"
                }
            },
            "must_not": {
                "term": {
                    "customer_last_name": "bailey"
                }
            }
        }
    }
}

// 4-38 복수 개의 쿼리를 사용하는 should 타입
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name",
        "day_of_week"
    ],
    "query": {
        "bool": {
            "should": [
                {
                    "term": {
                        "day_of_week": "sunday"
                    }
                },
                {
                    "match": {
                        "customer_full_name": "mary"
                    }
                }
            ]
        }
    }
}
/**
    should 타입에서 복수 개의 쿼리를 사용하며녀 OR 조건
 */

GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name",
        "day_of_week"
    ],
    "query": {
        "bool": {
            "must": {
                "match": {
                    "customer_full_name": "mary"
                }
            },
            "should": {
                "term": {
                    "day_of_week": "Monday"
                }
            }
        }
    }
}
/**
    should 타입이 다른 타입과 함께 사용되는 경우 
    should 타입에 적은 쿼리는 검색 결과에 영향을 주지 않고 스코어에만 영향을 줌.
 */

// 4-41 하나의 쿼리를 사용하는 filter 타입
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "products.base_price"
    ],
    "query": {
        "bool": {
            "filter": {
                "range": {
                    "products.base_price": {
                        "gte": 30,
                        "lte": 60
                    }
                }
            }
        }
    }
}
/** 
    filter는 must와 같은 동작을 하지만 필터 컨텍스트로 동작
    유사도 스코어에 영향을 미치지 않고, 계산하지 않는다.

    성능 향상에 도움이 됨.
 */

// 4-42 filter오아 must 타입을 같이 사용하는 쿼리
GET kibana_sample_data_ecommerce/_search
{
    "_source": [
        "customer_full_name",
        "day_of_week"
    ],
    "query": {
        "bool": {
            "filter": {
                "term": {
                    "day_of_week": "Sunday"
                }
            },
            "must": {
                "match": {
                    "customer_full_name": "mary"
                }
            }
        }
    }
}

// 4-43 와일드카드 패턴 검색
GET kibana_sample_data_ecommerce/_search
{
    "_source": "customer_full_name",
    "query": {
        "wildcard": {
            "customer_full_name.keyword": "M?r*"
        }
    }
}