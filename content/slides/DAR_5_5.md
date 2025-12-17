---
date: "2025-12-11"
draft: true
title: "DAR-5-5"
author: MTandHJ
tags:
    - Slide
    - DAR
---

<!-- --------------------------------------------------------- -->

<section data-markdown>
## 无监督学习: 变分自编码
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 知识回顾

- **问题:** 部分观测条件下密度函数估计问题:

    $$
        p(\underbrace{\textcolor{blue}{\bm{x}}}_{观测数据}, \underbrace{\textcolor{red}{\bm{z}}}_{隐变量}; \theta).
    $$

- **EM 算法 (Expectation Maximization Algorithm):**
    - **E 步:** 计算期望对数似然函数

        $$
        Q(\theta, \theta^{t-1}) := \sum_{i=1}^N \underset{\bm{z}_i \sim p(\bm{z}|\bm{x}_i; \theta^{t-1})}{\mathbb{E}} \left[
            \log p(\bm{x}_i, \bm{z}_i; \theta)
        \right]
        $$

    - **M 步:** 最大化期望对数似然函数

        $$
        \theta^t = \underset{\theta}{\text{argmax}} \: Q(\theta, \theta^{t-1})
        $$

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 知识回顾

- **高斯混合分布 (Gaussian Mixture Model):**

    $$
        p(\bm{x}; \theta) = \sum_{k=1}^K \alpha_k \varphi(\bm{x}; \bm{\mu_k}, \bm{\Sigma}_k), \: \sum_{k=1}^K \alpha_k = 1.
    $$

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251211154717.png" 
alt="Image" 
style="max-width: 60%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 变分自编码 (VAE, Variational Autoencoder)

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251211155312.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 变分自编码 (VAE, Variational Autoencoder)

<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251211155312.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

<div class="slide-highlight">
与 EM、VAE 核心思想一脉相承
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 一般模型下的 EM 算法

- **一般模型:**

    $$
    \sum_{k=1}^K \alpha_k \varphi(\bm{x}; \bm{\mu_k}, \bm{\Sigma}_k) \rightarrow
    p(\bm{x}; \theta) = \int_{\bm{z}} p(\bm{x}|\bm{z}; \theta) p(\bm{z}) \mathrm{d} \bm{z}
    $$

- **对数似然:**

    $$
    \ell(\bm{x}, \bm{z}; \theta) = \sum_{i=1}^N \log p(\bm{x}_i, \bm{z}_i; \theta)
    $$

- **期望对数似然:**

    $$
    Q(\theta, \hat{\theta}) = \mathbb{E}_{\bm{z}} \left[\ell (\bm{x}, \bm{z}; \theta) \right]
    $$

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## (期望) 对数似然间的关系

<p style="font-size: 0.63em">
$$
\begin{align*}
    Q(\theta, \hat{\theta}) 
    &= \mathbb{E}_{\bm{z}} \left[\ell (\bm{x}, \bm{z}; \theta) \right]
    = \sum_{i=1}^N \int_{\bm{z}} p(\bm{z}|\bm{x}_i; \hat{\theta}) \log p(\bm{x}_i, \bm{z}; \theta) \mathrm{d} \bm{z} \\
    &\textcolor{red}{\Leftrightarrow} \sum_{i=1}^N \int_{\bm{z}} p(\bm{z}|\bm{x}_i; \hat{\theta}) 
    \log \frac{p(\bm{x}_i, \bm{z}; \theta)}{\textcolor{red}{p(\bm{z}|\bm{x}_i; \hat{\theta})}} \mathrm{d} \bm{z} \\
\end{align*}
$$
</p>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## (期望) 对数似然间的关系

<p style="font-size: 0.63em">
$$
\begin{align*}
    Q(\theta, \hat{\theta}) 
    &= \mathbb{E}_{\bm{z}} \left[\ell (\bm{x}, \bm{z}; \theta) \right]
    = \sum_{i=1}^N \int_{\bm{z}} p(\bm{z}|\bm{x}_i; \hat{\theta}) \log p(\bm{x}_i, \bm{z}; \theta) \mathrm{d} \bm{z} \\
    &\textcolor{red}{\Leftrightarrow} \sum_{i=1}^N \int_{\bm{z}} p(\bm{z}|\bm{x}_i; \hat{\theta}) 
    \log \frac{p(\bm{x}_i, \bm{z}; \theta)}{\textcolor{red}{p(\bm{z}|\bm{x}_i; \hat{\theta})}} \mathrm{d} \bm{z} \\
    &= \sum_{i=1}^N \int_{\bm{z}} p(\bm{z}|\bm{x}_i; \hat{\theta}) 
    \log \frac{p(\bm{z}| \bm{x}_i; \theta) p(\bm{x}_i; \theta)}{p(\bm{z}|\bm{x}_i; \hat{\theta})} \mathrm{d} \bm{z} \\
    &= \sum_{i=1}^N \int_{\bm{z}} p(\bm{z}|\bm{x}_i; \hat{\theta}) 
    \left(\log p(\bm{x}_i; \theta) + \log \frac{p(\bm{z}| \bm{x}_i; \theta) }{p(\bm{z}|\bm{x}_i; \hat{\theta})} \right) \mathrm{d} \bm{z} \\
    &= \sum_{i=1}^N \Big\{\log p(\bm{x}_i; \theta) - \text{KL}(p(\bm{z}|\bm{x}_i; \hat{\theta}) \| p(\bm{z}|\bm{x}_i; \theta)) \Big\}
\end{align*}
$$
</p>

<div class="slide-ref">
  <div style="width: 100px; height: 1px; background: black; margin-bottom: 5px;"></div>
  <p style="margin: 2px 0;">
  Kullback-Leibler Divergence: $\text{KL}(p\|q) = \int_z p(z) \log \frac{p(z)}{q(z)} \mathrm{d} z$
  </p>
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 从 EM 算法到 VAE

$$
\begin{align*}
    Q(\theta, \hat{\theta}) 
    &\Leftrightarrow \sum_{i=1}^N \int_{\bm{z}} p(\bm{z}|\bm{x}_i; \hat{\theta}) 
    \log \frac{p(\bm{x}_i, \bm{z}; \theta)}{p(\bm{z}|\bm{x}_i; \hat{\theta})} \mathrm{d} \bm{z} \\
    &= \sum_{i=1}^N \Big\{\underbrace{\log p(\bm{x}_i; \theta)}_{\text{边际似然}} - 
    \underbrace{\text{KL}(p(\bm{z}|\bm{x}_i; \hat{\theta}) \| p(\bm{z}|\bm{x}_i; \theta))}_{\text{GAP, } \ge 0} \Big\}
\end{align*}
$$


</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 从 EM 算法到 VAE

$$
\begin{align*}
    Q(\theta, \hat{\theta}) 
    &\Leftrightarrow \sum_{i=1}^N \int_{\bm{z}} p(\bm{z}|\bm{x}_i; \hat{\theta}) 
    \log \frac{p(\bm{x}_i, \bm{z}; \theta)}{p(\bm{z}|\bm{x}_i; \hat{\theta})} \mathrm{d} \bm{z} \\
    &= \sum_{i=1}^N \Big\{\underbrace{\log p(\bm{x}_i; \theta)}_{\text{边际似然}} - 
    \underbrace{\text{KL}(p(\bm{z}|\bm{x}_i; \hat{\theta}) \| p(\bm{z}|\bm{x}_i; \theta))}_{\text{GAP, } \ge 0} \Big\}
\end{align*}
$$

<div class='slide-highlight'>
$\textcircled{\small 1}$  最大化 $Q$ $\Leftrightarrow$ 最大化似然下界
</div>

<div class='slide-highlight'>
$\textcircled{\small 2}$ $\hat{\theta} = \theta$ 时完全等价最大似然
</div>

</textarea>
</section>


<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## ELBO (Evidence Lower Bound)

$$
\theta^t = \mathop{\text{argmax}} \limits_{\theta} \sum_{i=1}^N \int_{\bm{z}} \textcolor{red}{p(\bm{z}|\bm{x}_i; \theta^{t-1})}
\log \frac{p(\bm{x}_i, \bm{z}; \theta)}{\textcolor{red}{p(\bm{z}|\bm{x}_i; \theta^{t-1})}} \mathrm{d} \bm{z}
$$

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## ELBO (Evidence Lower Bound)

$$
\theta^t = \mathop{\text{argmax}} \limits_{\theta} \sum_{i=1}^N \int_{\bm{z}} \textcolor{red}{p(\bm{z}|\bm{x}_i; \theta^{t-1})}
\log \frac{p(\bm{x}_i, \bm{z}; \theta)}{\textcolor{red}{p(\bm{z}|\bm{x}_i; \theta^{t-1})}} \mathrm{d} \bm{z}
$$

<div class='slide-highlight'>
一般情况下 $p(\bm{z}|\bm{x}; \theta)$ 难以处理
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## ELBO (Evidence Lower Bound)

$$
\theta^t = \mathop{\text{argmax}} \limits_{\theta} \sum_{i=1}^N \int_{\bm{z}} \textcolor{red}{p(\bm{z}|\bm{x}_i; \theta^{t-1})}
\log \frac{p(\bm{x}_i, \bm{z}; \theta)}{\textcolor{red}{p(\bm{z}|\bm{x}_i; \theta^{t-1})}} \mathrm{d} \bm{z}
$$

<div class='slide-highlight'>
一般情况下 $p(\bm{z}|\bm{x}; \theta)$ 难以处理
</div>

&nbsp;

$$
\text{ELBO:} \quad \sum_{i=1}^N \int_{\bm{z}} \textcolor{blue}{q(\bm{z}|\bm{x}_i; \phi)}
\log \frac{p(\bm{x}_i, \bm{z}; \theta)}{\textcolor{blue}{q(\bm{z}|\bm{x}_i; \phi)}} \mathrm{d} \bm{z}
$$

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 变分自编码 (VAE)


<div class="slide-img">
<img src="https://raw.githubusercontent.com/MTandHJ/blog_source/master/images/20251211214031.png" 
alt="Image" 
style="max-width: 100%; height: auto;margin: 0 auto;">
</div>

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 从 VAE 到 EM 算法

$$
\max_{\phi, \theta} \quad \sum_{i=1}^N \int_{\bm{z}} q(\bm{z}|\bm{x}_i; \phi)
\log \frac{p(\bm{x}_i, \bm{z}; \theta)}{q(\bm{z}|\bm{x}_i; \phi)} \mathrm{d} \bm{z}
$$

- **E 步:** 保持 $\theta$ 固定, 关于 $\phi$

    $$
    \max_{\textcolor{blue}{\phi}} \quad -\sum_{i=1}^N \text{KL} (q(\bm{z}|\bm{x}_i; \textcolor{blue}{\phi}) \| p(\bm{z}|\bm{x}_i; \theta))
    $$


- **M 步:** 保持 $\phi$ 固定, 关于 $\theta$

    $$
    \max_{\textcolor{blue}{\theta}} \quad \sum_{i=1}^N \mathbb{E}_q [\log p(\bm{x}_i| \bm{z}; \textcolor{blue}{\theta})]
    $$

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 知识点总结

- 期望对数似然 $\Leftrightarrow$ ELBO $\Leftrightarrow$ 对数似然下界

- 从 EM 算法到 VAE

|| EM | VAE |
|:-:|:-:|:-:|
|优化目标| ELBO | ELBO |
|近似后验| $p(\bm{z}\vert \bm{x}; \theta^{t-1})$ | $q(\bm{z}\vert \bm{x}; \phi)$ |
|收敛性|✅||
|灵活性|❎|✅|

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section data-markdown>
<textarea data-template>

## 课后扩展

- 了解 KL 散度距离的非对称性以及 JS 散度

- 通过 Jensen's inequality 直接证明

    $$
    \text{ELBO} \le \sum_{i=1}^N \log p(\bm{x}_i; \theta)
    $$

- 仿照 EM $\rightarrow$ ELBO 的方法反推 VAE $\rightarrow$ EM

</textarea>
</section>

<!-- --------------------------------------------------------- -->

<section>


<div style="
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40%;
  font-size: 10rem;
">
  Thanks!
</div>

</section>

<!-- --------------------------------------------------------- -->