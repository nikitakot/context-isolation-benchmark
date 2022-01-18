# SYNC IPC, 100000 iterations

![graphs](./_Users_nikitakot_code_ms_playground_context-isolation-benchmark_index.html.png)

# E10

```
ctx isolation:  true
renderer.js:131 ASYNC IPC, 100000 iterations
renderer.js:133 primitive
renderer.js:51 avg:  2025.6253803000523
renderer.js:53 median:  2103.23249999783
renderer.js:55 p95:  2202.594999980647
renderer.js:57 total:  3775.614999991376
renderer.js:136 string
renderer.js:51 avg:  2069.192396499918
renderer.js:53 median:  2189.66500001261
renderer.js:55 p95:  2300.770250026835
renderer.js:57 total:  3888.990000006743
renderer.js:139 object
renderer.js:51 avg:  4540.448487300018
renderer.js:53 median:  4607.065000018338
renderer.js:55 p95:  6148.9762500161305
renderer.js:57 total:  8731.985000020359
renderer.js:146 SYNC IPC, 100000 iterations
renderer.js:148 primitive
renderer.js:69 avg:  0.06685685001837555
renderer.js:71 median:  0.059999991208314896
renderer.js:73 p95:  0.09999994654208422
renderer.js:75 total:  6745.764999999665
renderer.js:151 string
renderer.js:69 avg:  0.07107354995561764
renderer.js:71 median:  0.06000004941597581
renderer.js:73 p95:  0.1200000406242907
renderer.js:75 total:  7171.60000000149
renderer.js:154 object
renderer.js:69 avg:  0.07830644998175558
renderer.js:71 median:  0.07000000914558768
renderer.js:73 p95:  0.11500000255182385
renderer.js:75 total:  7878.3800000092015

ctx isolation:  false
renderer.js:131 ASYNC IPC, 100000 iterations
renderer.js:133 primitive
renderer.js:51 avg:  1370.587766550011
renderer.js:53 median:  1239.3274999922141
renderer.js:55 p95:  2307.5299999909475
renderer.js:57 total:  3117.224999994505
renderer.js:136 string
renderer.js:51 avg:  1452.8277141000578
renderer.js:53 median:  1311.2900000123773
renderer.js:55 p95:  2395.8817499689753
renderer.js:57 total:  3232.8100000158884
renderer.js:139 object
renderer.js:51 avg:  3251.881188100074
renderer.js:53 median:  3292.3975000157952
renderer.js:55 p95:  4729.7809999930905
renderer.js:57 total:  5797.940000018571
renderer.js:146 SYNC IPC, 100000 iterations
renderer.js:148 primitive
renderer.js:69 avg:  0.06446460007806308
renderer.js:71 median:  0.059999991208314896
renderer.js:73 p95:  0.0950000248849392
renderer.js:75 total:  6498.874999990221
renderer.js:151 string
renderer.js:69 avg:  0.06443944999366068
renderer.js:71 median:  0.059999991208314896
renderer.js:73 p95:  0.0950000248849392
renderer.js:75 total:  6497.830000007525
renderer.js:154 object
renderer.js:69 avg:  0.0695697500143433
renderer.js:71 median:  0.06000004941597581
renderer.js:73 p95:  0.10500004282221198
renderer.js:75 total:  7002.740000025369
```
# E16

```
ctx isolation:  true
renderer.js:131 ASYNC IPC, 100000 iterations
renderer.js:133 primitive
renderer.js:51 avg:  2039.442777000094
renderer.js:53 median:  2105.2999999523163
renderer.js:55 p95:  2269.100000023842
renderer.js:57 total:  3790.400000035763
renderer.js:136 string
renderer.js:51 avg:  2079.2903600000973
renderer.js:53 median:  2173.5
renderer.js:55 p95:  2322.699999988079
renderer.js:57 total:  3846.199999988079
renderer.js:139 object
renderer.js:51 avg:  4063.1153219998996
renderer.js:53 median:  4037.5
renderer.js:55 p95:  5813.099999967218
renderer.js:57 total:  7686.399999976158
renderer.js:146 SYNC IPC, 100000 iterations
renderer.js:148 primitive
renderer.js:69 avg:  0.17531199999988079
renderer.js:71 median:  0.09999996423721313
renderer.js:73 p95:  1
renderer.js:75 total:  17591.399999976158
renderer.js:151 string
renderer.js:69 avg:  0.06651500000357628
renderer.js:71 median:  0.09999996423721313
renderer.js:73 p95:  0.19999998807907104
renderer.js:75 total:  6703.700000047684
renderer.js:154 object
renderer.js:69 avg:  0.07632
renderer.js:71 median:  0.09999996423721313
renderer.js:73 p95:  0.19999998807907104
renderer.js:75 total:  7678

ctx isolation:  false
renderer.js:131 ASYNC IPC, 100000 iterations
renderer.js:133 primitive
renderer.js:51 avg:  1467.3736249999536
renderer.js:53 median:  1385.5999999940395
renderer.js:55 p95:  2408.2049999862897
renderer.js:57 total:  3245
renderer.js:136 string
renderer.js:51 avg:  1370.2592760001994
renderer.js:53 median:  1257.550000011921
renderer.js:55 p95:  2277.300000011921
renderer.js:57 total:  3097
renderer.js:139 object
renderer.js:51 avg:  1470.6375929999251
renderer.js:53 median:  1371.7000000476837
renderer.js:55 p95:  2495.300000011921
renderer.js:57 total:  3336.199999988079
renderer.js:146 SYNC IPC, 100000 iterations
renderer.js:148 primitive
renderer.js:69 avg:  0.06216499999284744
renderer.js:71 median:  0.09999996423721313
renderer.js:73 p95:  0.19999998807907104
renderer.js:75 total:  6270
renderer.js:151 string
renderer.js:69 avg:  0.0683210000050068
renderer.js:71 median:  0.09999996423721313
renderer.js:73 p95:  0.19999998807907104
renderer.js:75 total:  6887.800000011921
renderer.js:154 object
renderer.js:69 avg:  0.06955500000059604
renderer.js:71 median:  0.09999996423721313
renderer.js:73 p95:  0.19999998807907104
renderer.js:75 total:  7000.099999964237
```