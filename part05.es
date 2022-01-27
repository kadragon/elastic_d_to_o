// 5-3 평균값을 구하는 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "stats_aggs": {
            "avg": {
                "field": "products.base_price"
            }
        }
    }
}
/**
    "size": 0 을 활용하면 집계에 사용한 도큐먼트를 결과에 포함하지 않음.
    ""stats_aggs" 라는 집계 이름으로 products.base_price 필드의 평균값을 구함.
 */

// 5-4 백분위를 구하는 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "stats_aggs": {
            "percentiles": {
                "field": "products.base_price",
                "percents": [
                    25,
                    50,
                    75
                ]
            }
        }
    }
}

// 5-5 cardinality 요청 (유니크한 값의 개수 확인)
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "card_aggs": {
            "cardinality": {
                "field": "day_of_week",
                "precision_threshold": 100
            }
        }
    }
}
/** 
    precision_threshold 는 정밀도로
    일반적으로 예상되는 실제 결과보다 크게 잡아야 함.
    기본값은 3000이며, 최대 40000까지 값을 설정할 수 있음.

    버킷 집계의 일종인 용어 집계(term)를 사용하면 유니크한 필드 개수와 함께
    필드값을 확인 할 수 있음.
*/

// 5-6 용어 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "day_of_week_aggs": {
            "terms": {
                "field": "day_of_week"
            }
        }
    }
}

// 5-7 쿼리를 이용해 집계 범위 지정
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "query": {
        "term": {
            "day_of_week": "Monday"
        }
    },
    "aggs": {
        "price_sum": {
            "sum": {
                "field": "products.base_price"
            }
        },
        "price_max": {
            "min": {
                "field": "products.base_price"
            }
        }
    }
}

// 5-8 히스토그램 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "histogram_aggs": {
            "histogram": {
                "field": "products.base_price",
                "interval": 100
            }
        }
    }
}

// 5-10 범위 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "range_aggs": {
            "range": {
                "field": "products.base_price",
                "ranges": [
                    {
                        "from": 0,
                        "to": 50
                    },
                    {
                        "from": 50,
                        "to": 100
                    },
                    {
                        "from": 100,
                        "to": 200
                    },
                    {
                        "from": 200,
                        "to": 1000
                    }
                ]
            }
        }
    }
}

// 5-11 용어 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "terms_aggs": {
            "terms": {
                "field": "day_of_week",
                "size": 6
            }
        }
    }
}
/**
    용어 집계 요청 'day_of_week' 필드 값을 기준으로
    도큐먼트 수가 많은 상위 6개의 버킷을 요청
    기본값은 10개

    "doc_count_error_upper_bound": 0
    오류의 가능성이 존재하기 때문에 위 결과값을 참고 해야 함.
 */

// 5-12 용어 집계 오류 확인 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "terms_aggs": {
            "terms": {
                "field": "day_of_week",
                "size": 6,
                "show_term_doc_count_error": true,
                "shard_size": 100
            }
        }
    }
}
/**
    "show_term_doc_count_error": true 을 통해 버킷마다 오류 확인
    shard_size를 조정, shard_size는 용어 집계 과정에서 개별 샤드에서 집계를 위해 처리하는 개수를 의미
    샤드 크기를 크게 하면 정확도가 올라가는 대신, 리소스 사용량이 올라가 성능이 하락함.
 */

// 5-14 버킷 집계 후 매트릭 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "term_buckets": {
            "terms": {
                "field": "day_of_week",
                "size": 5
            },
            "aggs": {
                "avg": {
                    "avg": {
                        "field": "products.base_price"
                    }
                }
            }
        }
    }
}
/**
    day_of_week로 버킷을 나누는데, 상위 5개만 사용
    버킷별 products.base_price의 avg를 구함.
 */

// 5-15 버킷 집계 후 다수의 메트릭 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "term_buckets": {
            "terms": {
                "field": "day_of_week",
                "size": 5
            },
            "aggs": {
                "avg": {
                    "avg": {
                        "field": "products.base_price"
                    }
                },
                "sum": {
                    "sum": {
                        "field": "products.base_price"
                    }
                }
            }
        }
    }
}

// 5-16 서브 버킷 생성 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "histogra_aggs": {
            "histogram": {
                "field": "products.base_price",
                "interval": 100
            },
            "aggs": {
                "term_aggs": {
                    "terms": {
                        "field": "day_of_week",
                        "size": 2
                    }
                }
            }
        }
    }
}

// 5-17 누적합을 구하는 부모 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "histogram_aggs": {
            "histogram": {
                "field": "products.base_price",
                "interval": 100
            },
            "aggs": {
                "sum_aggs": {
                    "sum": {
                        "field": "products.base_price"
                    }
                },
                "cum_sum": {
                    "cumulative_sum": {
                        "buckets_path": "sum_aggs"
                    }
                }
            }
        }
    }
}

// 5-18 총합을 구하는 형제 집계 요청
GET kibana_sample_data_ecommerce/_search
{
    "size": 0,
    "aggs": {
        "term_aggs": {
            "terms": {
                "field": "day_of_week",
                "size": 2
            },
            "aggs": {
                "sum_aggs": {
                    "sum": {
                        "field": "products.base_price"
                    }
                }
            }
        },
        "sum_total_price": {
            "sum_bucket": {
                "buckets_path": "term_aggs>sum_aggs"
            }
        }
    }
}
